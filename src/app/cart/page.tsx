
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  
  // Initialize cart with state to allow dynamic updates
  const [items, setItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // In a real application, this would fetch from localStorage or an API
    // For this prototype, we'll initialize with a subset of products
    const initialItems = Products.slice(0, 3).map(p => ({
      ...p,
      quantity: 1
    }));
    setItems(initialItems);
    setIsLoaded(true);
  }, []);

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // Prevent hydration mismatch by waiting for mount
  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Keranjang Belanja</h1>
      </header>

      <main className="pt-20 px-4 space-y-3">
        {items.length > 0 ? (
          <>
            {items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-100 shadow-sm">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Varian: Default</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 h-8 w-8 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                      <button 
                        className="text-primary hover:bg-white p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        className="text-primary hover:bg-white p-1 rounded transition-all"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total Harga ({items.length} Barang)</span>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Keranjang Kosong</h2>
              <p className="text-sm text-muted-foreground mt-1 px-10">Yuk temukan produk favoritmu sekarang.</p>
            </div>
            <Link href="/">
              <Button className="bg-primary text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <div>
            <p className="text-xs text-muted-foreground">Total Belanja</p>
            <p className="text-lg font-bold text-primary leading-tight">Rp {total.toLocaleString()}</p>
          </div>
          <Link href="/checkout" className="w-1/2">
            <Button className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
