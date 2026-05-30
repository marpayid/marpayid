
'use client';

import * as Icons from 'lucide-react';
import { Categories } from '@/app/lib/dummy-data';
import { useRouter } from 'next/navigation';

export function CategoryMenu() {
  const router = useRouter();

  const handleCategoryClick = (catName: string) => {
    if (catName === 'Top Up') {
      router.push('/kategori/top-up');
    } else {
      router.push('/categories');
    }
  };

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-6 px-4 py-6 bg-white border-b border-gray-50">
      {Categories.map((cat) => {
        const LucideIcon = (Icons as any)[cat.icon];
        return (
          <div 
            key={cat.id} 
            className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16 group cursor-pointer"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-active:scale-95 transition-transform border border-gray-100 shadow-sm">
              {LucideIcon && <LucideIcon className="w-6 h-6 stroke-[1.5px]" />}
            </div>
            <span className="text-[10px] font-bold text-gray-600 text-center line-clamp-1">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}
