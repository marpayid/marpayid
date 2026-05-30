import * as Icons from 'lucide-react';
import { Categories } from '@/app/lib/dummy-data';

export function CategoryMenu() {
  return (
    <div className="grid grid-cols-5 gap-y-6 px-4 py-8 bg-white mt-2">
      {Categories.map((cat) => {
        const LucideIcon = (Icons as any)[cat.icon];
        return (
          <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-active:scale-95 transition-transform border border-gray-100 shadow-sm">
              {LucideIcon && <LucideIcon className="w-6 h-6 stroke-[1.5px]" />}
            </div>
            <span className="text-[10px] font-medium text-gray-600 text-center">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}