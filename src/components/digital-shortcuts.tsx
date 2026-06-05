
'use client';

import { Smartphone, Wallet, Zap, Gamepad2, Wifi } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SERVICES = [
  { id: 'pulsa', name: 'Pulsa', icon: Smartphone, path: '/kategori/top-up/pulsa', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { id: 'wallet', name: 'E-Wallet', icon: Wallet, path: '/kategori/top-up/e-wallet', color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { id: 'pln', name: 'Token PLN', icon: Zap, path: '/kategori/top-up/token-pln', color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { id: 'game', name: 'Game', icon: Gamepad2, path: '/kategori/top-up/game', color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { id: 'data', name: 'Paket Data', icon: Wifi, path: '/kategori/top-up', color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
];

export function DigitalShortcuts() {
  return (
    <section className="bg-white px-4 py-5 border-b border-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Layanan Digital</h2>
        <Link href="/kategori/top-up" className="text-[10px] font-bold text-primary">Lihat Semua</Link>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {SERVICES.map((service) => (
          <Link key={service.id} href={service.path} className="flex flex-col items-center gap-2 group active:scale-95 transition-all">
            <div className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-sm border border-white",
              service.bgColor,
              service.color
            )}>
              <service.icon className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-600 text-center leading-tight">
              {service.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
