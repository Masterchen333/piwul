import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'Jimpitan Digital RT — Transparan, Akuntabel, Real-Time',
  description: 'Platform digitalisasi iuran jimpitan warga RT berbasis QR Code dan Google Sheets.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-12">
          {children}
        </main>
        <footer className="glass-card rounded-none border-b-0 border-x-0 border-t border-white/10 text-center py-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Jimpitan Digital RT — Gotong Royong Digital Warga.</p>
        </footer>
      </body>
    </html>
  );
}
