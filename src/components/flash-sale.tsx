"use client"

import { useState, useEffect } from 'react';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShoppingCart, Star } from 'lucide-react';

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 44, s: 50 });

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

  const flashSaleItems = Products.filter(p => p.isFlashSale);

  return (
    <section className="mt-6 px-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-md font-black italic tracking-tighter text-orange-600 uppercase">Flash Sale</h2>
          <div className="flex items-center gap-1.5">
            <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold">:</span>
            <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold">:</span>
            <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.s.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Link href="/" className="text-xs font-bold text-primary flex items-center gap-0.5">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {flashSaleItems.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} className="min-w-[140px] bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm group">
            <div className="relative aspect-square">
              <Image 
                src={item.image || ''} 
                alt={item.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                {item.discount} OFF
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-[11px] font-medium text-gray-800 line-clamp-1 mb-1">{item.name}</h3>
              <p className="text-sm font-bold text-red-600">Rp {item.price.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1 opacity-70">
                 <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                 <span className="text-[9px] font-semibold">{item.rating}</span>
                 <span className="text-[9px] border-l pl-1 ml-1">{item.sold >= 1000 ? `${(item.sold/1000).toFixed(1)}rb+` : item.sold} terjual</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}