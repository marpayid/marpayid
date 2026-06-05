
"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/use-products';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from './product-grid';

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 44, s: 50 });
  const { products } = useProducts();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mengecualikan kategori Premium dari Flash Sale
  const flashSaleItems = products.filter(p => p.isFlashSale && p.category !== 'Premium');

  return (
    <section id="flash-sale-section" className="mt-2 px-4 py-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black italic tracking-tighter text-orange-600 uppercase leading-none">Flash Sale</h2>
          <div className="flex items-center gap-1">
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[20px] text-center">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold text-xs">:</span>
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[20px] text-center">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold text-xs">:</span>
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[20px] text-center">{timeLeft.s.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Link href="/" className="text-[11px] font-bold text-primary flex items-center">
          Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {flashSaleItems.map((item) => (
          <ProductCard key={item.id} product={item} compact={true} />
        ))}
      </div>
    </section>
  );
}
