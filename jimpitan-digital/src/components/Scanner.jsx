'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function Scanner({ onScanSuccess }) {
  const [scannedResult, setScannedResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setErrorMsg('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      setIsScanning(true);

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedResult(decodedText);
          stopScanner();
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // ignore scan errors per frame
        }
      );
    } catch (err) {
      setErrorMsg('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        console.error('Failed to stop scanner', e);
      }
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setScannedResult(manualInput.trim());
      if (onScanSuccess) {
        onScanSuccess(manualInput.trim());
      }
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-emerald-400" /> Scan QR Code Warga
      </h3>

      <div id="qr-reader" className="w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-4 min-h-[260px] flex items-center justify-center">
        {!isScanning && !scannedResult && (
          <div className="text-center p-6 text-slate-400">
            <Camera className="w-12 h-12 mx-auto mb-2 text-slate-500 opacity-60" />
            <p className="text-sm">Klik tombol dibawah untuk membuka kamera HP</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-lg text-xs mb-4 flex items-center gap-2 w-full">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {scannedResult && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg text-sm mb-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold truncate">Payload: {scannedResult}</span>
          </div>
          <button
            onClick={() => {
              setScannedResult('');
              startScanner();
            }}
            className="text-xs text-emerald-400 underline hover:text-emerald-300 ml-2"
          >
            Rescan
          </button>
        </div>
      )}

      <div className="flex gap-2 w-full mb-4">
        {!isScanning ? (
          <button onClick={startScanner} className="btn-primary w-full">
            <Camera className="w-4 h-4" /> Buka Kamera HP
          </button>
        ) : (
          <button onClick={stopScanner} className="btn-primary bg-red-600 hover:bg-red-700 w-full">
            Hentikan Kamera
          </button>
        )}
      </div>

      <div className="w-full border-t border-white/10 pt-4 mt-2">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Atau ketik ID/Payload Warga..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="glass-input text-sm flex-1"
          />
          <button type="submit" className="btn-primary text-xs px-3">
            Cek
          </button>
        </form>
      </div>
    </div>
  );
}
