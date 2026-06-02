'use client';

import { Ticket, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function VoucherSection() {
  const vouchers = [
    {
      id: 1,
      title: 'Voucher Belanja',
      description: 'Diskon hingga Rp20.000',
      info: 'Kuota telah habis',
      icon: Ticket,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
      badge: 'Habis'
    },
    {
      id: 2,
      title: 'Gratis Ongkir',
      description: 'Potongan ongkir hingga Rp15.000',
      info: 'Kuota telah habis',
      icon: Truck,
      color: 'bg-primary/10',
      textColor: 'text-primary',
      badge: 'Habis'
    },
  ];

  return (
    <section className="px-4 py-6 bg-white border-y border-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Voucher Spesial Untukmu</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TERBATAS</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {vouchers.map((v) => (
          <div 
            key={v.id} 
            className="relative flex-shrink-0 w-[260px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex group grayscale opacity-60"
          >
            {/* Left side (Icon) */}
            <div className={cn("w-20 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-100", v.color)}>
              <v.icon className={cn("w-7 h-7", v.textColor)} />
              <div className="bg-white/80 px-1.5 py-0.5 rounded-md">
                <span className={cn("text-[8px] font-black uppercase tracking-tighter", v.textColor)}>{v.badge}</span>
              </div>
            </div>

            {/* Right side (Content) */}
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{v.title}</h4>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{v.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-400">{v.info}</span>
                </div>
                <Button 
                  disabled 
                  size="sm" 
                  className="h-7 px-4 rounded-lg bg-gray-200 text-gray-400 text-[9px] font-black border-none uppercase"
                >
                  Klaim
                </Button>
              </div>
            </div>

            {/* Ticket Cutouts for Dashed Effect */}
            <div className="absolute top-[-8px] left-[72px] w-4 h-4 bg-white rounded-full border border-gray-50 z-10"></div>
            <div className="absolute bottom-[-8px] left-[72px] w-4 h-4 bg-white rounded-full border border-gray-50 z-10"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
