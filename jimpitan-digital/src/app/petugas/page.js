'use client';

import { useState } from 'react';
import Scanner from '@/components/Scanner';
import { QrCode, CheckCircle, AlertTriangle, XCircle, DollarSign, Calendar, RefreshCw, UserCheck } from 'lucide-react';

export default function PetugasPage() {
  const [scannedWarga, setScannedWarga] = useState(null);
  const [arrearsData, setArrearsData] = useState(null);
  const [numWeeksToPay, setNumWeeksToPay] = useState(1);
  const [scanHistory, setScanHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  // Mock DB of residents
  const sampleWargaMap = {
    'WRG-BLK1-001': { id_warga: 'WRG-BLK1-001', nama_warga: 'Bpk. Ahmad Subagyo', blok_dawis: 'Blok 1', arrearsWeeks: 0, unpaidFridays: [] },
    'WRG-BLK1-002': { id_warga: 'WRG-BLK1-002', nama_warga: 'Bpk. Budi Santoso', blok_dawis: 'Blok 1', arrearsWeeks: 2, unpaidFridays: ['24 Juli 2026', '31 Juli 2026'] },
    'WRG-BLK2-001': { id_warga: 'WRG-BLK2-001', nama_warga: 'Bpk. Candra Wijaya', blok_dawis: 'Blok 2', arrearsWeeks: 4, unpaidFridays: ['10 Juli 2026', '17 Juli 2026', '24 Juli 2026', '31 Juli 2026'] },
  };

  const handleScanSuccess = (payload) => {
    // Find resident by payload or ID
    const found = sampleWargaMap[payload] || {
      id_warga: payload,
      nama_warga: `Warga (${payload})`,
      blok_dawis: 'Blok 1',
      arrearsWeeks: 1,
      unpaidFridays: ['31 Juli 2026']
    };

    setScannedWarga(found);
    
    // Check badging
    let badge = 'GREEN';
    if (found.arrearsWeeks >= 3) badge = 'RED';
    else if (found.arrearsWeeks > 0) badge = 'YELLOW';

    setArrearsData({
      arrearsWeeks: found.arrearsWeeks,
      statusBadge: badge,
      unpaidFridays: found.unpaidFridays,
      totalTagihan: (found.arrearsWeeks + 1) * 3000
    });

    // Default pay for arrears + current week
    setNumWeeksToPay(found.arrearsWeeks + 1);
  };

  const handleRecordPayment = () => {
    if (!scannedWarga) return;

    // Check double scan in history
    const alreadyScannedToday = scanHistory.some(s => s.id_warga === scannedWarga.id_warga);
    if (alreadyScannedToday) {
      setNotification({ type: 'error', message: `Peringatan: ${scannedWarga.nama_warga} sudah di-scan hari ini!` });
      return;
    }

    const totalBayar = numWeeksToPay * 3000;
    const newRecord = {
      id: Date.now(),
      id_warga: scannedWarga.id_warga,
      nama_warga: scannedWarga.nama_warga,
      blok_dawis: scannedWarga.blok_dawis,
      jumlah_pekan: numWeeksToPay,
      nominal: totalBayar,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setScanHistory([newRecord, ...scanHistory]);
    setNotification({ type: 'success', message: `Berhasil mencatat jimpitan ${scannedWarga.nama_warga} sebesar Rp ${totalBayar.toLocaleString('id-ID')}` });
    
    // Reset state
    setScannedWarga(null);
    setArrearsData(null);
  };

  const totalFisikTerkumpul = scanHistory.reduce((sum, item) => sum + item.nominal, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-6">
        <div>
          <span className="badge-green px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
            <UserCheck className="w-3.5 h-3.5" /> Petugas Lapangan
          </span>
          <h2 className="text-xl font-bold text-white">Scanner Jimpitan & Penarikan Field</h2>
          <p className="text-xs text-slate-400">Scan QR Code warga saat penarikan rumah-ke-rumah setiap hari Jumat.</p>
        </div>

        <div className="bg-slate-900/80 px-4 py-3 rounded-xl border border-white/10 text-right">
          <span className="text-xs text-slate-400 font-medium block">Total Fisik Lapangan Hari Ini</span>
          <span className="text-2xl font-black text-emerald-400">
            Rp {totalFisikTerkumpul.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border-red-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline">
            Tutup
          </button>
        </div>
      )}

      {/* Main Scanner Section */}
      {!scannedWarga ? (
        <Scanner onScanSuccess={handleScanSuccess} />
      ) : (
        /* Result & Payment Confirmation Form */
        <div className="glass-card p-6 max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Detail Warga Ter-scan</h3>
            <button
              onClick={() => {
                setScannedWarga(null);
                setArrearsData(null);
              }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Batal / Reset
            </button>
          </div>

          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/10">
            <div>
              <p className="text-xs text-slate-400">Nama Kepala Keluarga</p>
              <p className="text-lg font-bold text-white">{scannedWarga.nama_warga}</p>
            </div>

            <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-white/5">
              <span>ID Warga: <code className="text-emerald-400">{scannedWarga.id_warga}</code></span>
              <span>Wilayah: <strong>{scannedWarga.blok_dawis}</strong></span>
            </div>
          </div>

          {/* Status Badging & Arrears Info */}
          {arrearsData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Status Pembayaran:</span>
                {arrearsData.statusBadge === 'GREEN' && (
                  <span className="badge-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 🟢 Lunas / Tidak Ada Tunggakan
                  </span>
                )}
                {arrearsData.statusBadge === 'YELLOW' && (
                  <span className="badge-yellow px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 🟡 Menunggak {arrearsData.arrearsWeeks} Minggu
                  </span>
                )}
                {arrearsData.statusBadge === 'RED' && (
                  <span className="badge-red px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> 🔴 Menunggak ≥ 3 Minggu (Perhatian RT)
                  </span>
                )}
              </div>

              {arrearsData.unpaidFridays.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-amber-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Rincian Jumat Terlewat:
                  </p>
                  <ul className="list-disc list-inside text-slate-300">
                    {arrearsData.unpaidFridays.map((date) => (
                      <li key={date}>{date}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Multi-Week Payment Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Pilihan Bayar Jimpitan:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNumWeeksToPay(1)}
                className={`p-3 rounded-xl border text-xs text-center transition-all ${
                  numWeeksToPay === 1
                    ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                    : 'border-white/10 bg-slate-900/40 text-slate-400'
                }`}
              >
                Pekan Berjalan Saja
                <span className="block font-semibold mt-1 text-emerald-400">Rp 3.000 (1x)</span>
              </button>

              <button
                type="button"
                onClick={() => setNumWeeksToPay((arrearsData?.arrearsWeeks || 0) + 1)}
                className={`p-3 rounded-xl border text-xs text-center transition-all ${
                  numWeeksToPay > 1
                    ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                    : 'border-white/10 bg-slate-900/40 text-slate-400'
                }`}
              >
                Lunas Tunggakan + Jumat Ini
                <span className="block font-semibold mt-1 text-emerald-400">
                  Rp {(( (arrearsData?.arrearsWeeks || 0) + 1 ) * 3000).toLocaleString('id-ID')} ({ (arrearsData?.arrearsWeeks || 0) + 1 }x)
                </span>
              </button>
            </div>
          </div>

          <button onClick={handleRecordPayment} className="btn-primary w-full py-3 text-base">
            <DollarSign className="w-5 h-5" /> Terima Bayar Rp {(numWeeksToPay * 3000).toLocaleString('id-ID')}
          </button>
        </div>
      )}

      {/* Field History Session */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Log Setoran Penarikan Lapangan (Session Ini)</h3>
        {scanHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada penarikan tercatat hari ini.</p>
        ) : (
          <div className="space-y-2">
            {scanHistory.map((rec) => (
              <div key={rec.id} className="bg-slate-900/60 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">{rec.nama_warga} ({rec.blok_dawis})</p>
                  <p className="text-slate-400">{rec.timestamp} • {rec.jumlah_pekan} Pekan</p>
                </div>
                <span className="font-bold text-emerald-400 text-sm">
                  +Rp {rec.nominal.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
