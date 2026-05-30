
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marpay_address');
    if (saved) {
      try {
        setAddress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse address");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Alamat Pengiriman</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-primary">
          <Plus className="w-5 h-5" />
        </Button>
      </header>

      <main className="pt-20 px-4">
        {address ? (
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Utama</span>
                <h3 className="text-sm font-bold text-gray-900">{address.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400">{address.phone}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {address.fullAddress}, {address.district}, {address.city}, {address.province}
              </p>
              {address.notes && (
                <p className="text-[10px] text-primary font-medium bg-primary/5 inline-block px-2 py-0.5 rounded mt-2">
                  Catatan: {address.notes}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <MapPin className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Belum ada alamat tersimpan</h3>
            <p className="text-[10px] font-medium text-gray-500 mt-1 max-w-[200px]">
              Tambahkan alamat pengiriman untuk memudahkan proses checkout.
            </p>
            <Button className="mt-6 bg-primary text-white rounded-2xl px-8 h-12 font-bold">
              + Tambah Alamat
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
