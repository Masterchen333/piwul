'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, Filter, Download } from 'lucide-react';
import Link from 'next/link';

export default function GenerateQRPage() {
  const [selectedBlok, setSelectedBlok] = useState('Semua');

  const wargaList = [
    { id_warga: 'WRG-BLK1-001', nama_warga: 'Bpk. Ahmad Subagyo', blok_dawis: 'Blok 1', no_rumah: 'No. 01' },
    { id_warga: 'WRG-BLK1-002', nama_warga: 'Bpk. Budi Santoso', blok_dawis: 'Blok 1', no_rumah: 'No. 02' },
    { id_warga: 'WRG-BLK1-003', nama_warga: 'Bpk. Joko Susilo', blok_dawis: 'Blok 1', no_rumah: 'No. 03' },
    { id_warga: 'WRG-BLK2-001', nama_warga: 'Bpk. Candra Wijaya', blok_dawis: 'Blok 2', no_rumah: 'No. 12' },
    { id_warga: 'WRG-BLK2-002', nama_warga: 'Bpk. Dedi Kurniawan', blok_dawis: 'Blok 2', no_rumah: 'No. 14' },
    { id_warga: 'WRG-BLK3-001', nama_warga: 'Bpk. Eko Prasetyo', blok_dawis: 'Blok 3', no_rumah: 'No. 25' },
    { id_warga: 'WRG-BLK3-002', nama_warga: 'Bpk. Hendra Gunawan', blok_dawis: 'Blok 3', no_rumah: 'No. 28' },
  ];

  const filteredWarga = selectedBlok === 'Semua'
    ? wargaList
    : wargaList.filter(w => w.blok_dawis === selectedBlok);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header - Excluded from Print */}
      <div className="no-print glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">Cetak QR Code Warga (Kartu Jimpitan)</h2>
            <p className="text-xs text-slate-400">Layout siap cetak untuk ditempel di teras / depan pintu rumah warga.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBlok}
              onChange={(e) => setSelectedBlok(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="Semua">Semua Wilayah</option>
              <option value="Blok 1">Blok 1</option>
              <option value="Blok 2">Blok 2</option>
              <option value="Blok 3">Blok 3</option>
            </select>
          </div>

          <button onClick={handlePrint} className="btn-primary text-xs">
            <Printer className="w-4 h-4" /> Cetak Kartu ({filteredWarga.length})
          </button>
        </div>
      </div>

      {/* Grid Cards Siap Cetak */}
      <div className="print-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredWarga.map((warga) => (
          <div
            key={warga.id_warga}
            className="bg-white text-slate-900 p-6 rounded-2xl border-2 border-emerald-600 shadow-xl flex flex-col items-center justify-between text-center min-h-[300px] relative overflow-hidden"
          >
            {/* Top Badge Banner */}
            <div className="w-full bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold uppercase tracking-wider rounded-t-lg -mt-6 -mx-6 mb-4 flex justify-between items-center">
              <span>🪙 JIMPITAN RT</span>
              <span>{warga.blok_dawis}</span>
            </div>

            <div className="my-2 p-3 bg-slate-50 border-2 border-emerald-200 rounded-2xl">
              <QRCodeSVG
                value={warga.id_warga}
                size={140}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="mt-3 space-y-0.5">
              <h3 className="font-extrabold text-base text-slate-900">{warga.nama_warga}</h3>
              <p className="text-xs text-slate-600 font-semibold">{warga.no_rumah} • <span className="font-mono text-emerald-800">{warga.id_warga}</span></p>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 mt-2">
                Poin Penarikan Resmi Petugas RT • Nominal Rp 3.000 / Jumat
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
