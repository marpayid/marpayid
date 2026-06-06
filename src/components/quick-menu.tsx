
"use client"

import { Package, Ticket, Flame, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function QuickMenu() {
  const menuItems = [
    { 
      label: 'Pesanan', 
      icon: Package, 
      color: 'text-blue-600', 
      path: '/akun/transaksi' 
    },
    { 
      label: 'Voucher', 
      icon: Ticket, 
      color: 'text-orange-500', 
      path: '/akun/voucher',
      badge: '2'
    },
    { 
      label: 'Promo', 
      icon: Flame, 
      color: 'text-rose-500', 
      path: '/' 
    },
    { 
      label: 'Ongkir', 
      icon: Truck, 
      color: 'text-primary', 
      path: '/' 
    },
  ];

  return (
    <section className="bg-white px-4 pt-4 pb-2">
      <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center h-[82px] divide-x divide-gray-50 overflow-hidden">
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            href={item.path}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full active:bg-gray-50 transition-colors relative group"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-active:scale-90",
              item.color.replace('text-', 'bg-') + '/10',
              item.color
            )}>
              <item.icon className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">
              {item.label}
            </span>
            
            {item.badge && (
              <span className="absolute top-3.5 right-4 bg-red-500 text-white text-[7px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white animate-in zoom-in">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
