'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, QrCode, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('petugas'); // 'petugas' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Silakan isi username dan password!');
      return;
    }

    setLoading(true);

    try {
      // Try authentication via proxy API first
      const response = await fetch('/api/jimpitan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });

      const resData = await response.json();

      if (resData.success && resData.petugas) {
        const user = resData.petugas;
        const userRole = user.role || (role === 'admin' ? 'admin' : 'petugas');
        localStorage.setItem('userSession', JSON.stringify({
          role: userRole,
          name: user.nama_petugas,
          id_petugas: user.id_petugas,
          blok_tugas: user.blok_tugas
        }));

        setLoading(false);
        if (userRole === 'admin' || role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/petugas');
        }
        return;
      }
    } catch (err) {
      // Fallback offline validation
    }

    // Fallback Demo Validation
    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        if (username === 'admin' && password === 'admin123') {
          localStorage.setItem('userSession', JSON.stringify({ role: 'admin', name: 'Bendahara RT (Admin)' }));
          router.push('/admin');
        } else {
          setErrorMsg('Username/Password Admin salah! (Gunakan: admin / admin123)');
        }
      } else {
        if (username === 'petugas1' && password === '1234') {
          localStorage.setItem('userSession', JSON.stringify({ role: 'petugas', name: 'Petugas Penarik Blok 1', id_petugas: 'PTG-01', blok_tugas: 'Blok 1' }));
          router.push('/petugas');
        } else {
          setErrorMsg('Username/PIN Petugas salah! (Gunakan: petugas1 / 1234)');
        }
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30 text-emerald-400 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Login Sistem</h2>
          <p className="text-sm text-slate-400">Pilih akses sesuai peran Anda</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setRole('petugas');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'petugas' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" /> Petugas Penarik
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin / Bendahara
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={role === 'admin' ? 'admin' : 'petugas1'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input w-full pl-9 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password / PIN</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder={role === 'admin' ? 'admin123' : '1234'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-9 text-sm"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Memproses...' : 'Masuk Aplikasi'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        <div className="text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-1">
          <p className="font-semibold text-slate-300">💡 Demo Credentials:</p>
          <p>• <strong>Petugas:</strong> Username: <code className="text-emerald-400">petugas1</code> | PIN: <code className="text-emerald-400">1234</code></p>
          <p>• <strong>Admin:</strong> Username: <code className="text-emerald-400">admin</code> | Password: <code className="text-emerald-400">admin123</code></p>
        </div>
      </div>
    </div>
  );
}
