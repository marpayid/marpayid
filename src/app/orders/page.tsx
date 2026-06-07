
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Halaman ini sebelumnya berisi DATA DUMMY statis.
 * Dialihkan ke /akun/transaksi untuk melihat data asli dari FIRESTORE.
 */
export default function OrdersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/akun/transaksi');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
       <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sinkronisasi Pesanan...</p>
    </div>
  );
}
