"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  const cartItems = Products.slice(0, 3);

  const total = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Keranjang Belanja</h1>
      </header>

      <main className="pt-20 px-4 space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-100 shadow-sm">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Varian: Default</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                  <button className="text-primary hover:bg-white p-1 rounded"><Minus className="w-3 h-3" /></button>
                  <span className="text-xs font-bold w-4 text-center">1</span>
                  <button className="text-primary hover:bg-white p-1 rounded"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Total Harga ({cartItems.length} Barang)</span>
            <span className="text-sm font-medium">Rp {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Total Ongkir</span>
            <span className="text-sm font-medium text-green-500">Gratis</span>
          </div>
          <div className="border-t border-gray-100 my-3 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total Bayar</span>
            <span className="font-bold text-primary">Rp {total.toLocaleString()}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-muted-foreground">Total Belanja</p>
          <p className="text-lg font-bold text-primary leading-tight">Rp {total.toLocaleString()}</p>
        </div>
        <Link href="/checkout" className="w-1/2">
          <Button className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}