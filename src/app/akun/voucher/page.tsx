"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MyVouchersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Voucher Saya</h1>
      </header>

      <main className="pt-20 px-4">
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
            <Ticket className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Belum ada voucher tersedia</h3>
          <p className="text-sm text-gray-400 mt-2 text-center max-w-[250px] leading-relaxed">
            Nantikan promo dan voucher menarik lainnya khusus untuk pengguna setia MarPay.
          </p>
          <Link href="/" className="mt-8 w-full max-w-[200px]">
            <Button className="w-full bg-primary text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
