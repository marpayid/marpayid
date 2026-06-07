
'use client';

import * as Icons from 'lucide-react';
import { Categories } from '@/app/lib/dummy-data';
import { useRouter } from 'next/navigation';

export function CategoryMenu() {
  const router = useRouter();

  const handleCategoryClick = (catName: string) => {
    if (catName === 'Top Up') {
      router.push('/kategori/top-up');
    } else if (catName === 'Premium') {
      router.push('/kategori/premium');
    } else if (catName === 'E-Wallet') {
      router.push('/kategori/top-up/e-wallet');
    } else if (catName === 'Game') {
      router.push('/kategori/top-up/game');
    } else {
      router.push(`/kategori/${catName.toLowerCase()}`);
    }
  };

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-5 px-4 pt-3 pb-6 bg-white border-b border-gray-50 items-start">
      {Categories.map((cat) => {
        const LucideIcon = (Icons as any)[cat.icon];
        return (
          <div 
            key={cat.id} 
            className="flex flex-col items-center gap-2 flex-shrink-0 w-[4.5rem] group cursor-pointer"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-active:scale-95 transition-transform border border-gray-100 shadow-sm">
              {LucideIcon && <LucideIcon className="w-6 h-6 stroke-[1.8px]" />}
            </div>
            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight line-clamp-2 px-1">
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
