'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, QrCode, Shield, UserCheck, LogIn, Home } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-card rounded-none border-t-0 border-x-0 border-b border-white/10 px-4 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
            <Coins className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide text-white">Jimpitan Digital</h1>
            <p className="text-xs text-slate-400 font-medium">RT Transparan & Akuntabel</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/10">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" /> Dashboard Warga
          </Link>

          <Link
            href="/petugas"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/petugas') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" /> Petugas Penarik
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/admin') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin RT
          </Link>

          <Link
            href="/admin/generate-qr"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/admin/generate-qr') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Cetak QR Warga
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>
      </div>
    </header>
  );
}
