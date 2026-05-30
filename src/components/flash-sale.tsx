"use client"

import { useState, useEffect } from 'react';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';

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
    <section className="mt-2 px-4 py-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black italic tracking-tighter text-orange-600 uppercase">Flash Sale</h2>
          <div className="flex items-center gap-1">
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[18px] text-center">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold text-xs">:</span>
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[18px] text-center">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-orange-600 font-bold text-xs">:</span>
            <span className="bg-orange-600 text-white px-1 py-0.5 rounded text-[10px] font-bold min-w-[18px] text-center">{timeLeft.s.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Link href="/" className="text-[10px] font-bold text-primary flex items-center">
          Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
        {flashSaleItems.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} className="min-w-[130px] w-[130px] bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm group">
            <div className="relative aspect-[4/3]">
              <Image 
                src={item.image || ''} 
                alt={item.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                {item.discount}
              </div>
            </div>
            <div className="p-2">
              <h3 className="text-[10px] font-medium text-gray-800 line-clamp-1 mb-0.5">{item.name}</h3>
              <p className="text-xs font-bold text-red-600">Rp {item.price.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1 opacity-70">
                 <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                 <span className="text-[8px] font-semibold">{item.rating}</span>
                 <span className="text-[8px] border-l pl-1 ml-1 leading-none">{item.sold >= 1000 ? `${(item.sold/1000).toFixed(1)}rb` : item.sold} terjual</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
