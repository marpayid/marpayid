
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Smartphone, Zap, Wallet, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { cn, getProductImage } from '@/lib/utils';

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('marpay_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem('marpay_cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleRemove = (id: number | string, variant: string) => {
    const newItems = items.filter(item => !(item.id === id && item.variant === variant));
    saveCart(newItems);
  };

  const updateQuantity = (id: number | string, variant: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.id === id && item.variant === variant) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(newItems);
  };

  const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  
  // LOGIKA ONGKIR: Jumlahkan (ongkir_per_produk * quantity) untuk semua item
  const shippingFee = items.reduce((acc, item) => {
    const fee = item.shippingFee || 0;
    return acc + (fee * item.quantity);
  }, 0);

  const finalTotal = total + shippingFee;

  const renderProductImage = (item: any) => {
    if (item.category === 'Premium' || item.category?.toLowerCase() === 'premium') {
      return <div className="relative w-full h-full"><Image src="/premium1.png" alt="Premium" fill className="object-cover" /></div>;
    }
    
    if (item.image === '/pulsa-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Smartphone className="w-10 h-10" /></div>;
    if (item.image === '/pln-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Zap className="w-10 h-10" /></div>;
    if (item.image === '/e-wallet-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Wallet className="w-10 h-10" /></div>;
    
    const displayImage = getProductImage(item);
    if (displayImage) return <Image src={displayImage} alt={item.name} fill className="object-cover" />;
    return <ShoppingBag className="w-10 h-10 text-gray-200" />;
  };

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
            {items.map((item, idx) => {
              const itemShipping = (item.shippingFee || 0) * item.quantity;
              return (
                <div key={`${item.id}-${item.variant || idx}`} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-100 shadow-sm">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {renderProductImage(item)}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">Varian: {item.variant || 'Default'}</p>
                        {itemShipping > 0 ? (
                          <span className="text-[9px] font-bold text-gray-400 flex items-center gap-0.5">
                            <Truck className="w-2.5 h-2.5" /> Rp {itemShipping.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Gratis Ongkir</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8 hover:text-red-500 hover:bg-red-50" onClick={() => handleRemove(item.id, item.variant)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                        <button className="text-primary hover:bg-white p-1 rounded disabled:opacity-30" onClick={() => updateQuantity(item.id, item.variant, -1)} disabled={item.quantity <= 1}><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button className="text-primary hover:bg-white p-1 rounded" onClick={() => updateQuantity(item.id, item.variant, 1)}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-6">
              <div className="flex justify-between mb-2"><span className="text-sm text-gray-600">Total Harga</span><span className="text-sm font-medium">Rp {total.toLocaleString()}</span></div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total Ongkir</span>
                <span className={cn("text-sm font-medium", shippingFee === 0 ? "text-green-500" : "text-gray-900")}>
                  {shippingFee === 0 ? "Gratis" : `Rp ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-gray-100 my-3 pt-3 flex justify-between"><span className="font-bold">Total Bayar</span><span className="font-bold text-primary">Rp {finalTotal.toLocaleString()}</span></div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-10 h-10" /></div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900">Keranjang Kosong</h2>
              <p className="text-sm text-gray-400">Yuk mulai belanja sekarang!</p>
            </div>
            <Link href="/"><Button className="bg-primary text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20">Mulai Belanja</Button></Link>
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-[100] shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <div><p className="text-[10px] text-muted-foreground font-bold uppercase">Total Belanja</p><p className="text-lg font-bold text-primary">Rp {finalTotal.toLocaleString()}</p></div>
          <Link href="/checkout" className="w-1/2" onClick={() => localStorage.removeItem('marpay_checkout_temp')}>
            <Button className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
