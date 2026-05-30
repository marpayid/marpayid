"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';

export default function Checkout() {
  const router = useRouter();
  const items = Products.slice(0, 2);
  const total = items.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Pengiriman</h1>
      </header>

      <main className="pt-20 px-4 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <MapPin className="w-5 h-5 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-bold mb-1">Alamat Pengiriman</h3>
            <p className="text-xs font-semibold">Budi Santoso (Rumah)</p>
            <p className="text-xs text-muted-foreground mt-0.5">Jl. Merdeka No. 123, Kel. Gambir, Kec. Gambir, Jakarta Pusat, 10110</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
               <span className="text-[10px] font-bold text-primary">M</span>
            </div>
            <span className="text-sm font-bold">MarPay Official Store</span>
          </div>
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium line-clamp-1">{item.name}</h4>
                <p className="text-xs font-bold mt-1 text-primary">Rp {item.price.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Jumlah: 1</p>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">Pilih Pengiriman</span>
            </div>
            <span className="text-xs font-bold">Reguler (Gratis)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <h3 className="text-sm font-bold">Metode Pembayaran</h3>
            <p className="text-xs text-muted-foreground">MarPay Balance (Rp 2.500.000)</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <h3 className="text-sm font-bold mb-2">Ringkasan Belanja</h3>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total Harga ({items.length} Barang)</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total Ongkos Kirim</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Diskon Voucher</span>
            <span className="text-primary">-Rp 50.000</span>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between font-bold">
            <span className="text-sm">Total Tagihan</span>
            <span className="text-sm text-primary">Rp {(total - 50000).toLocaleString()}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-muted-foreground">Total Tagihan</p>
          <p className="text-lg font-bold text-primary leading-tight">Rp {(total - 50000).toLocaleString()}</p>
        </div>
        <Button className="w-1/2 bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}