
"use client"

import { Flame, Package, Tag, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function QuickMenu() {
  const menuItems = [
    { 
      label: 'Sedang Viral', 
      sub: '120+ Produk',
      icon: Flame, 
      path: '/' 
    },
    { 
      label: 'Produk Terbaru', 
      sub: 'Update Hari Ini',
      icon: Package, 
      path: '/' 
    },
    { 
      label: 'Diskon Besar', 
      sub: 'Hingga 70%',
      icon: Tag, 
      path: '/' 
    },
    { 
      label: 'Beauty Terlaris', 
      sub: 'Pilihan Terbaik',
      icon: Droplets, 
      path: '/kategori/beauty' 
    },
  ];

  return (
    <section className="bg-white px-4 pt-4 pb-2">
      <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center h-[90px] divide-x divide-gray-50 overflow-hidden">
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            href={item.path}
            className="flex-1 flex flex-col items-center justify-center h-full active:bg-gray-50/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center transition-all duration-300 group-active:scale-90 mb-1.5">
              <item.icon className="w-5 h-5 text-primary stroke-[2.2px]" />
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-[9px] font-black text-gray-800 uppercase tracking-tighter leading-none">
                {item.label}
              </span>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider mt-1 opacity-80">
                {item.sub}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
