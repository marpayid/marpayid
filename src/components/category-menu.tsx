import * as Icons from 'lucide-react';
import { Categories } from '@/app/lib/dummy-data';
import { cn } from '@/lib/utils';

export function CategoryMenu() {
  return (
    <div className="grid grid-cols-4 gap-y-4 px-4 py-6 bg-white rounded-2xl shadow-sm mx-4 -mt-4 relative z-10 border border-gray-50">
      {Categories.map((cat) => {
        const LucideIcon = (Icons as any)[cat.icon];
        return (
          <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              {LucideIcon && <LucideIcon className="w-6 h-6 stroke-[1.5px]" />}
            </div>
            <span className="text-[11px] font-medium text-gray-600">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}