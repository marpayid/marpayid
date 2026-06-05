
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shirt, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import { BottomNav } from '@/components/bottom-nav';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function FashionCategoryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Semua');
  
  // Ambil hanya produk dengan kategori Fashion
  const fashionProducts = Products.filter(p => p.category === 'Fashion');

  const filters = ['Semua', 'Kaos', 'Kemeja', 'Promo'];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Fashion</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </header>

      <main className="pt-20 px-4">
        {/* Banner Hero Mini */}
        <div className="relative rounded-[24px] overflow-hidden h-36 bg-gradient-to-br from-primary via-emerald-600 to-emerald-800 p-6 flex flex-col justify-center text-white shadow-lg shadow-primary/10 mb-6">
           <Shirt className="absolute right-[-15px] top-[-15px] w-36 h-36 text-white/10 rotate-12" />
           <div className="relative z-10">
             <h2 className="text-xl font-black leading-tight mb-1">Fashion Pilihan</h2>
             <p className="text-[10px] text-white/80 font-medium leading-relaxed max-w-[180px]">
               Temukan produk fashion terbaik di MarPay
             </p>
           </div>
        </div>

        {/* Chips Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-1 px-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap",
                activeFilter === filter 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105" 
                  : "bg-white text-gray-400 border-gray-100 hover:border-primary/30"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Product Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {fashionProducts.length} Produk ditemukan
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {fashionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Empty State jika filter tidak ada (simulasi) */}
        {fashionProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Produk tidak tersedia</h3>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
