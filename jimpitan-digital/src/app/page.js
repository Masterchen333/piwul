'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Users, Flame, Award, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState({
    warga: [
      { id_warga: 'WRG-BLK1-001', nama_warga: 'Bpk. Ahmad Subagyo', blok_dawis: 'Blok 1', status: 'Aktif' },
      { id_warga: 'WRG-BLK1-002', nama_warga: 'Bpk. Budi Santoso', blok_dawis: 'Blok 1', status: 'Aktif' },
      { id_warga: 'WRG-BLK2-001', nama_warga: 'Bpk. Candra Wijaya', blok_dawis: 'Blok 2', status: 'Aktif' },
      { id_warga: 'WRG-BLK2-002', nama_warga: 'Bpk. Dedi Kurniawan', blok_dawis: 'Blok 2', status: 'Aktif' },
      { id_warga: 'WRG-BLK3-001', nama_warga: 'Bpk. Eko Prasetyo', blok_dawis: 'Blok 3', status: 'Aktif' },
    ],
    transaksi: [
      { id_transaksi: 'TRX-101', timestamp: '2026-08-01 19:30', id_warga: 'WRG-BLK1-001', nama_warga: 'Bpk. Ahmad Subagyo', nominal: 3000, nama_petugas: 'Petugas Blok 1' },
      { id_transaksi: 'TRX-102', timestamp: '2026-08-01 19:35', id_warga: 'WRG-BLK1-002', nama_warga: 'Bpk. Budi Santoso', nominal: 3000, nama_petugas: 'Petugas Blok 1' },
      { id_transaksi: 'TRX-103', timestamp: '2026-08-01 19:40', id_warga: 'WRG-BLK2-001', nama_warga: 'Bpk. Candra Wijaya', nominal: 6000, nama_petugas: 'Petugas Blok 2' },
      { id_transaksi: 'TRX-104', timestamp: '2026-08-01 19:45', id_warga: 'WRG-BLK3-001', nama_warga: 'Bpk. Eko Prasetyo', nominal: 3000, nama_petugas: 'Petugas Blok 3' },
    ],
    kasKeluar: [
      { id_pengeluaran: 'OUT-01', tanggal: '2026-07-28', kategori: 'Penerangan Jalan', nominal: 75000, keterangan: 'Pembelian 3 Bohlam Lampu Jalan RT', url_nota: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500' },
      { id_pengeluaran: 'OUT-02', tanggal: '2026-07-20', kategori: 'Kebersihan', nominal: 50000, keterangan: 'Pembelian Sapu Lidi & Plastik Sampah Kerja Bakti', url_nota: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500' }
    ]
  });

  const totalMasuk = data.transaksi.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  const totalKeluar = data.kasKeluar.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  const saldoKas = totalMasuk - totalKeluar;

  // Calculate block activity percentage
  const blockCounts = { 'Blok 1': 0, 'Blok 2': 0, 'Blok 3': 0 };
  data.transaksi.forEach(t => {
    const w = data.warga.find(x => x.id_warga === t.id_warga);
    if (w && blockCounts[w.blok_dawis] !== undefined) {
      blockCounts[w.blok_dawis]++;
    }
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner & Summary Cards */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <span className="badge-green px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Transparansi Real-Time
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Dashboard Kas Jimpitan Warga</h2>
            <p className="text-slate-400 text-sm mt-1">Laporan penerimaan iuran Rp 3.000 / minggu & penggunaan dana RT.</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Saldo Kas Terkini</span>
            <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
              Rp {saldoKas.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Kas Masuk</p>
              <p className="text-lg font-bold text-white">Rp {totalMasuk.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="bg-rose-500/20 p-3 rounded-xl border border-rose-500/30 text-rose-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Kas Keluar</p>
              <p className="text-lg font-bold text-white">Rp {totalKeluar.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Warga Terdaftar</p>
              <p className="text-lg font-bold text-white">{data.warga.length} Rumah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Competitiveness & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" /> Inter-Block Leaderboard (Tingkat Keaktifan)
            </h3>
            <span className="text-xs text-slate-400">Pekan Ini</span>
          </div>

          <div className="space-y-4">
            {['Blok 1', 'Blok 2', 'Blok 3'].map((blok, idx) => {
              const count = blockCounts[blok] || 0;
              const percentage = Math.min(100, Math.round((count / 2) * 100));
              return (
                <div key={blok} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-white">{blok}</span>
                    <span className="text-emerald-400 font-bold">{count} Transaksi ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" /> Predikat Warga Taat
          </h3>
          <div className="space-y-3">
            {data.warga.slice(0, 3).map((w, idx) => (
              <div key={w.id_warga} className="bg-slate-900/60 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{w.nama_warga}</p>
                  <p className="text-xs text-slate-400">{w.blok_dawis}</p>
                </div>
                <span className="badge-green text-xs px-2.5 py-1 rounded-full font-bold">
                  Streak 4x 🔥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Laporan Pengeluaran & Nota */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-400" /> Transparansi Kas Keluar & Bukti Nota
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.kasKeluar.map((kas) => (
            <div key={kas.id_pengeluaran} className="bg-slate-900/60 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold">
                    {kas.kategori}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">{kas.keterangan}</h4>
                  <p className="text-xs text-slate-400">{kas.tanggal}</p>
                </div>
                <span className="text-sm font-bold text-rose-400">
                  -Rp {Number(kas.nominal).toLocaleString('id-ID')}
                </span>
              </div>

              {kas.url_nota && (
                <a
                  href={kas.url_nota}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline font-medium pt-2 border-t border-white/5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat Nota Kuitansi
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
