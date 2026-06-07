
"use client"

import { Flame, Gem, Sparkles, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function QuickMenu() {
  const menuItems = [
    { 
      label: 'Sedang Viral', 
      sub: '120+ Produk',
      icon: Flame, 
      color: 'text-orange-600', 
      path: '/' 
    },
    { 
      label: 'Pilihan', 
      sub: 'Rating Tinggi',
      icon: Gem, 
      color: 'text-blue-600', 
      path: '/' 
    },
    { 
      label: 'Terbaru', 
      sub: 'Update Hari Ini',
      icon: Sparkles, 
      color: 'text-emerald-600', 
      path: '/' 
    },
    { 
      label: 'Diskon Gede', 
      sub: 'Hingga 70%',
      icon: Tag, 
      color: 'text-rose-600', 
      path: '/' 
    },
  ];

  return (
    <section className="bg-white px-4 pt-4 pb-2">
      <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center h-[90px] divide-x divide-gray-50 overflow-hidden">
        {menuItems.map((item) => (
          <div 
            key={item.label}
            className="flex-1 flex flex-col items-center justify-center h-full active:bg-gray-50/80 transition-all cursor-pointer group"
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-active:scale-90 mb-1.5",
              item.color.replace('text-', 'bg-') + '/10',
              item.color
            )}>
              <item.icon className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-tighter leading-none">
                {item.label}
              </span>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider mt-1 opacity-80">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
