
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SecurityPage() {
  const router = useRouter();

  const options = [
    { label: 'Ubah Nama', icon: User, value: 'Budi Santoso' },
    { label: 'Ubah Nomor HP', icon: Phone, value: '081234567890' },
    { label: 'Ubah Password', icon: Lock, value: '**********' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Keamanan Akun</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {options.map((opt, idx) => (
            <div 
              key={opt.label}
              className={`flex items-center justify-between p-5 active:bg-gray-50 transition-colors ${idx !== options.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <opt.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{opt.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{opt.value}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 text-center px-6 leading-relaxed">
          Kami menjaga privasi dan keamanan data Anda dengan standar enkripsi terbaru.
        </p>
      </main>
    </div>
  );
}
