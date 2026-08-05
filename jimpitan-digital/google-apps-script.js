/**
 * ============================================================================
 * 🪙 JIMPITAN DIGITAL RT — GOOGLE APPS SCRIPT BACKEND (DATABASE API)
 * ============================================================================
 * 
 * CARA DEPLOY DI GOOGLE SHEETS:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Klik menu: Extensions (Ekstensi) > Apps Script
 * 3. Hapus semua kode default, lalu COPAS seluruh isi file ini ke editor Apps Script.
 * 4. Jalankan fungsi 'setupDatabase()' satu kali untuk otomatis membuat 4 Sheet & data awal:
 *    - Data_Warga
 *    - Data_Petugas
 *    - Transaksi_Jimpitan
 *    - Kas_Keluar
 * 5. Klik 'Deploy' > 'New Deployment' (Penerapan Baru).
 * 6. Pilih type 'Web App':
 *    - Description: Jimpitan API v1
 *    - Execute as: Me (Email Anda)
 *    - Who has access: Anyone (Siapa saja)  <-- SANGAT PENTING agar API bisa dipanggil
 * 7. Copy URL Web App hasil deploy, lalu masukkan ke file `.env.local` proyek Next.js:
 *    NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/.../exec
 * 
 * ============================================================================
 */

/**
 * FUNGSI SETUP OTOMATIS
 * Jalankan fungsi ini sekali di Apps Script Editor untuk membuat 4 Sheet & header kolom.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Data_Warga
  let sheetWarga = ss.getSheetByName('Data_Warga');
  if (!sheetWarga) {
    sheetWarga = ss.insertSheet('Data_Warga');
    sheetWarga.appendRow(['id_warga', 'nama_warga', 'blok_dawis', 'qr_payload', 'status']);
    sheetWarga.appendRow(['WRG-BLK1-001', 'Bpk. Ahmad Subagyo', 'Blok 1', 'WRG-BLK1-001', 'Aktif']);
    sheetWarga.appendRow(['WRG-BLK1-002', 'Bpk. Budi Santoso', 'Blok 1', 'WRG-BLK1-002', 'Aktif']);
    sheetWarga.appendRow(['WRG-BLK2-001', 'Bpk. Candra Wijaya', 'Blok 2', 'WRG-BLK2-001', 'Aktif']);
    sheetWarga.appendRow(['WRG-BLK3-001', 'Bpk. Eko Prasetyo', 'Blok 3', 'WRG-BLK3-001', 'Aktif']);
  }

  // 2. Sheet Data_Petugas (Pengelola & Petugas)
  let sheetPetugas = ss.getSheetByName('Data_Petugas');
  if (!sheetPetugas) {
    sheetPetugas = ss.insertSheet('Data_Petugas');
    sheetPetugas.appendRow(['id_petugas', 'nama_petugas', 'username', 'password', 'role', 'blok_tugas']);
    sheetPetugas.appendRow(['ADM-01', 'Bendahara RT (Admin)', 'admin', 'admin123', 'admin', 'Semua Blok']);
    sheetPetugas.appendRow(['PTG-01', 'Petugas Blok 1', 'petugas1', '1234', 'petugas', 'Blok 1']);
    sheetPetugas.appendRow(['PTG-02', 'Petugas Blok 2', 'petugas2', '1234', 'petugas', 'Blok 2']);
    sheetPetugas.appendRow(['PTG-03', 'Petugas Blok 3', 'petugas3', '1234', 'petugas', 'Blok 3']);
  }

  // 3. Sheet Transaksi_Jimpitan
  let sheetTrx = ss.getSheetByName('Transaksi_Jimpitan');
  if (!sheetTrx) {
    sheetTrx = ss.insertSheet('Transaksi_Jimpitan');
    sheetTrx.appendRow(['id_transaksi', 'timestamp', 'id_warga', 'nama_warga', 'nominal', 'id_petugas', 'nama_petugas']);
    sheetTrx.appendRow(['TRX-101', new Date().toISOString(), 'WRG-BLK1-001', 'Bpk. Ahmad Subagyo', 3000, 'PTG-01', 'Petugas Blok 1']);
    sheetTrx.appendRow(['TRX-102', new Date().toISOString(), 'WRG-BLK1-002', 'Bpk. Budi Santoso', 3000, 'PTG-01', 'Petugas Blok 1']);
  }

  // 4. Sheet Kas_Keluar
  let sheetKeluar = ss.getSheetByName('Kas_Keluar');
  if (!sheetKeluar) {
    sheetKeluar = ss.insertSheet('Kas_Keluar');
    sheetKeluar.appendRow(['id_pengeluaran', 'tanggal', 'kategori', 'nominal', 'keterangan', 'url_nota']);
    sheetKeluar.appendRow(['OUT-01', new Date().toISOString().split('T')[0], 'Kebersihan', 50000, 'Pembelian Plastik Sampah & Sapu Lidi', 'https://drive.google.com']);
  }

  Logger.log('Setup Database Google Sheets Jimpitan Digital Berhasil!');
}

/**
 * HTTP GET HANDLER
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getData';
  const response = {};

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'getData') {
      response.warga = getSheetData(ss, 'Data_Warga');
      response.petugas = getSheetData(ss, 'Data_Petugas');
      response.transaksi = getSheetData(ss, 'Transaksi_Jimpitan');
      response.kasKeluar = getSheetData(ss, 'Kas_Keluar');
      response.success = true;
    } else if (action === 'getWargaByQR') {
      const qrPayload = e.parameter.qrPayload;
      const wargaList = getSheetData(ss, 'Data_Warga');
      const warga = wargaList.find(w => String(w.qr_payload) === String(qrPayload) || String(w.id_warga) === String(qrPayload));
      
      if (!warga) {
        return jsonResponse({ success: false, message: 'Warga tidak ditemukan!' });
      }

      // Calculate arrears based on recorded Friday transactions
      const transaksiList = getSheetData(ss, 'Transaksi_Jimpitan').filter(t => String(t.id_warga) === String(warga.id_warga));
      const arrearsInfo = calculateArrears(transaksiList);

      response.success = true;
      response.warga = warga;
      response.arrears = arrearsInfo;
    }

    return jsonResponse(response);
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString() });
  }
}

/**
 * HTTP POST HANDLER
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Action: Login Petugas / Admin
    if (action === 'login') {
      const petugasList = getSheetData(ss, 'Data_Petugas');
      const found = petugasList.find(p => String(p.username) === String(contents.username) && String(p.password) === String(contents.password));
      if (found) {
        return jsonResponse({ success: true, petugas: found });
      } else {
        return jsonResponse({ success: false, message: 'Username atau Password/PIN salah!' });
      }
    }

    // Action: Scan & Catat Jimpitan
    if (action === 'scanJimpitan') {
      const sheet = ss.getSheetByName('Transaksi_Jimpitan');
      const timestamp = new Date().toISOString();
      const numWeeks = contents.jumlah_pekan || 1;
      const nominalPerPekan = 3000;
      const totalNominal = contents.nominal || (nominalPerPekan * numWeeks);
      
      const newRows = [];
      const newTrxIds = [];

      for (let i = 0; i < numWeeks; i++) {
        const trxId = 'TRX-' + Date.now() + '-' + (i + 1);
        newTrxIds.push(trxId);
        newRows.push([
          trxId,
          timestamp,
          contents.id_warga,
          contents.nama_warga,
          nominalPerPekan,
          contents.id_petugas || 'PTG-01',
          contents.nama_petugas || 'Petugas Penarik'
        ]);
      }

      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, 7).setValues(newRows);
      return jsonResponse({ success: true, message: 'Berhasil mencatat jimpitan', trxIds: newTrxIds, totalNominal });
    }

    // Action: Catat Kas Keluar (Pengeluaran RT)
    if (action === 'addKasKeluar') {
      const sheet = ss.getSheetByName('Kas_Keluar');
      const outId = 'OUT-' + Date.now();
      sheet.appendRow([
        outId,
        contents.tanggal || new Date().toISOString().split('T')[0],
        contents.kategori,
        contents.nominal,
        contents.keterangan,
        contents.url_nota || ''
      ]);
      return jsonResponse({ success: true, message: 'Berhasil mencatat kas keluar', id: outId });
    }

    // Action: Tambah Data Warga Baru
    if (action === 'addWarga') {
      const sheet = ss.getSheetByName('Data_Warga');
      sheet.appendRow([
        contents.id_warga,
        contents.nama_warga,
        contents.blok_dawis,
        contents.qr_payload || contents.id_warga,
        contents.status || 'Aktif'
      ]);
      return jsonResponse({ success: true, message: 'Berhasil menambah data warga' });
    }

    return jsonResponse({ success: false, message: 'Action tidak dikenal' });
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString() });
  }
}

/**
 * HELPER: Baca Data Sheet menjadi Array of Objects
 */
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * HELPER: Kalkulasi Tunggakan berdasarkan Tanggal Jumat
 */
function calculateArrears(transaksiList) {
  const today = new Date();
  const fridays = [];
  
  // Ambil rincian tanggal Jumat 8 pekan terakhir
  for (let i = 0; i < 8; i++) {
    const d = new Date();
    d.setDate(today.getDate() - (i * 7));
    const day = d.getDay();
    const diff = d.getDate() - day + (day < 5 ? -2 : 5);
    const fridayDate = new Date(d.setDate(diff));
    const dateStr = fridayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!fridays.includes(dateStr)) {
      fridays.push(dateStr);
    }
  }

  const totalPaidCount = transaksiList.length;
  const unpaidFridays = [];
  
  for (let i = 0; i < fridays.length; i++) {
    if (i >= totalPaidCount) {
      unpaidFridays.push(fridays[i]);
    }
  }

  const arrearsWeeks = unpaidFridays.length;
  let statusBadge = 'GREEN'; // Green: Lunas
  if (arrearsWeeks >= 3) {
    statusBadge = 'RED'; // Red: >= 3 minggu
  } else if (arrearsWeeks > 0) {
    statusBadge = 'YELLOW'; // Yellow: 1-2 minggu
  }

  return {
    arrearsWeeks,
    statusBadge,
    unpaidFridays,
    totalTagihan: (arrearsWeeks + 1) * 3000
  };
}

/**
 * HELPER: Format Output JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
