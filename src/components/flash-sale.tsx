"use client"

import { useState, useEffect } from 'react';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 34, s: 12 });

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
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-headline font-bold text-gray-900">Flash Sale</h2>
          <div className="flex items-center gap-1">
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-red-600 font-bold">:</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-red-600 font-bold">:</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{timeLeft.s.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Link href="/" className="text-xs font-semibold text-primary">Lihat Semua</Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {flashSaleItems.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} className="min-w-[140px] bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
            <div className="relative aspect-square">
              <Image 
                src={item.image || ''} 
                alt={item.name} 
                fill 
                className="object-cover"
                data-ai-hint="digital product"
              />
              <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                {item.discount} OFF
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-bold text-red-600">Rp {(item.price/1000).toLocaleString()}rb</p>
              <p className="text-[10px] text-muted-foreground line-through">Rp {(item.originalPrice!/1000).toLocaleString()}rb</p>
              <div className="mt-2">
                <Progress value={Math.min(100, (100 - (item.stock || 0)))} className="h-1.5 bg-gray-100" />
                <p className="text-[9px] mt-1 font-semibold text-red-600">Segera Habis</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}