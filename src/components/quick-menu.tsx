"use client"

import { Tag, Truck, Sparkles, Zap, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const QUICK_MENU = [
  { id: 'promo', label: 'Promo Hari Ini', icon: Tag, color: 'text-rose-500', bgColor: 'bg-rose-50', path: '/' },
  { id: 'ongkir', label: 'Gratis Ongkir', icon: Truck, color: 'text-primary', bgColor: 'bg-primary/10', path: '/' },
  { id: 'viral', label: 'Produk Viral', icon: Sparkles, color: 'text-cyan-500', bgColor: 'bg-cyan-50', path: '/' },
  { id: 'flash', label: 'Flash Sale', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-50', sectionId: 'flash-sale-section' },
  { id: 'voucher', label: 'Voucher Belanja', icon: Ticket, color: 'text-indigo-500', bgColor: 'bg-indigo-50', path: '/akun/voucher' },
];

export function QuickMenu() {
  const router = useRouter();

  const handleAction = (item: any) => {
    if (item.sectionId) {
      const element = document.getElementById(item.sectionId);
      if (element) {
        const offset = 80; // Offset for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <section className="bg-white border-b border-gray-50 pt-1 pb-3.5">
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4">
        {QUICK_MENU.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleAction(item)}
            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-[22px] bg-white border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-all"
          >
            <div className={cn("w-8 h-8 rounded-2xl flex items-center justify-center shadow-inner", item.bgColor, item.color)}>
              <item.icon className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <span className="text-[10px] font-black text-gray-800 whitespace-nowrap tracking-tight uppercase">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
