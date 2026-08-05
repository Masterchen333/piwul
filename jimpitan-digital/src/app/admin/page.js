'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, PlusCircle, Users, UserCheck, FileText, ExternalLink, QrCode, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('kas_keluar'); // 'kas_keluar', 'warga', 'petugas', 'logs'
  
  // Kas Keluar form state
  const [kategori, setKategori] = useState('Kebersihan');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [urlNota, setUrlNota] = useState('');
  const [kasKeluarList, setKasKeluarList] = useState([
    { id: 'OUT-01', tanggal: '2026-07-28', kategori: 'Penerangan Jalan', nominal: 75000, keterangan: 'Pembelian 3 Bohlam Lampu Jalan RT', url_nota: 'https://drive.google.com/file/d/sample1' },
    { id: 'OUT-02', tanggal: '2026-07-20', kategori: 'Kebersihan', nominal: 50000, keterangan: 'Pembelian Sapu Lidi & Plastik Sampah', url_nota: 'https://drive.google.com/file/d/sample2' }
  ]);

  // Warga Form & State
  const [namaWarga, setNamaWarga] = useState('');
  const [blokDawis, setBlokDawis] = useState('Blok 1');
  const [wargaList, setWargaList] = useState([
    { id_warga: 'WRG-BLK1-001', nama_warga: 'Bpk. Ahmad Subagyo', blok_dawis: 'Blok 1', qr_payload: 'WRG-BLK1-001', status: 'Aktif' },
    { id_warga: 'WRG-BLK1-002', nama_warga: 'Bpk. Budi Santoso', blok_dawis: 'Blok 1', qr_payload: 'WRG-BLK1-002', status: 'Aktif' },
    { id_warga: 'WRG-BLK2-001', nama_warga: 'Bpk. Candra Wijaya', blok_dawis: 'Blok 2', qr_payload: 'WRG-BLK2-001', status: 'Aktif' },
    { id_warga: 'WRG-BLK3-001', nama_warga: 'Bpk. Eko Prasetyo', blok_dawis: 'Blok 3', qr_payload: 'WRG-BLK3-001', status: 'Aktif' },
  ]);

  // Handle Input Kas Keluar
  const handleAddKasKeluar = (e) => {
    e.preventDefault();
    if (!nominal || !keterangan) return;

    const newKas = {
      id: 'OUT-' + Date.now(),
      tanggal: new Date().toISOString().split('T')[0],
      kategori,
      nominal: Number(nominal),
      keterangan,
      url_nota: urlNota
    };

    setKasKeluarList([newKas, ...kasKeluarList]);
    setNominal('');
    setKeterangan('');
    setUrlNota('');
  };

  // Handle Input Warga
  const handleAddWarga = (e) => {
    e.preventDefault();
    if (!namaWarga) return;

    const newId = `WRG-${blokDawis.replace(' ', '').toUpperCase()}-${String(wargaList.length + 1).padStart(3, '0')}`;
    const newW = {
      id_warga: newId,
      nama_warga: namaWarga,
      blok_dawis: blokDawis,
      qr_payload: newId,
      status: 'Aktif'
    };

    setWargaList([...wargaList, newW]);
    setNamaWarga('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Admin */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="badge-green px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
            <Shield className="w-3.5 h-3.5" /> Full Access Admin
          </span>
          <h2 className="text-2xl font-bold text-white">Dashboard Kelola Kas & Data RT</h2>
          <p className="text-xs text-slate-400">Pengelolaan transaksi kas keluar, data warga, petugas penarik, & cetak QR Code.</p>
        </div>

        <Link href="/admin/generate-qr" className="btn-primary text-xs">
          <QrCode className="w-4 h-4" /> Mass Print QR Code Warga
        </Link>
      </div>

      {/* Tabs Nav */}
      <div className="flex gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kas_keluar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'kas_keluar' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Pencatatan Kas Keluar
        </button>

        <button
          onClick={() => setActiveTab('warga')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'warga' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Data Warga ({wargaList.length})
        </button>
      </div>

      {/* Tab 1: Kas Keluar */}
      {activeTab === 'kas_keluar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> Form Input Kas Keluar
            </h3>

            <form onSubmit={handleAddKasKeluar} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Pengeluaran</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="glass-input w-full text-xs"
                >
                  <option value="Kebersihan">Kebersihan & Sampah</option>
                  <option value="Pembangunan">Penerangan & Pembangunan</option>
                  <option value="Duka">Santunan Duka & Sosial</option>
                  <option value="Lainnya">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Keterangan Detail</label>
                <input
                  type="text"
                  placeholder="Catatan pengeluaran..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Nota / Kuitansi (Google Drive / Link)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={urlNota}
                  onChange={(e) => setUrlNota(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <button type="submit" className="btn-primary w-full text-xs py-2.5">
                Simpan Kas Keluar
              </button>
            </form>
          </div>

          <div className="glass-card p-6 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white">Daftar Log Pengeluaran RT</h3>
            <div className="space-y-3">
              {kasKeluarList.map((item) => (
                <div key={item.id} className="bg-slate-900/60 p-4 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {item.kategori}
                    </span>
                    <h4 className="font-bold text-white text-sm">{item.keterangan}</h4>
                    <p className="text-slate-400">{item.tanggal} • {item.id}</p>
                    {item.url_nota && (
                      <a href={item.url_nota} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> Link Nota Kuitansi
                      </a>
                    )}
                  </div>
                  <span className="font-bold text-rose-400 text-base">
                    -Rp {Number(item.nominal).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Data Warga */}
      {activeTab === 'warga' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> Tambah Warga Baru
            </h3>

            <form onSubmit={handleAddWarga} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Bambang"
                  value={namaWarga}
                  onChange={(e) => setNamaWarga(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Blok / Dawis</label>
                <select
                  value={blokDawis}
                  onChange={(e) => setBlokDawis(e.target.value)}
                  className="glass-input w-full text-xs"
                >
                  <option value="Blok 1">Blok 1</option>
                  <option value="Blok 2">Blok 2</option>
                  <option value="Blok 3">Blok 3</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full text-xs py-2.5">
                Simpan Warga Baru
              </button>
            </form>
          </div>

          <div className="glass-card p-6 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white">Daftar Warga Terdaftar</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-300 uppercase border-b border-white/10">
                  <tr>
                    <th className="p-3">ID Warga</th>
                    <th className="p-3">Nama Warga</th>
                    <th className="p-3">Blok / Dawis</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {wargaList.map((w) => (
                    <tr key={w.id_warga} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-emerald-400">{w.id_warga}</td>
                      <td className="p-3 font-semibold text-white">{w.nama_warga}</td>
                      <td className="p-3 text-slate-300">{w.blok_dawis}</td>
                      <td className="p-3">
                        <span className="badge-green px-2 py-0.5 rounded text-[10px] font-bold">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
