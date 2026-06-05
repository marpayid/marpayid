
'use client';

import { ShieldCheck, MessageCircle, Star, CreditCard } from 'lucide-react';

const BADGES = [
  { id: 1, label: 'Aman via Admin', desc: 'Transaksi Terjaga', icon: ShieldCheck, color: 'text-blue-600' },
  { id: 2, label: 'Konfirmasi WA', desc: 'Respon Cepat', icon: MessageCircle, color: 'text-emerald-600' },
  { id: 3, label: 'Produk Pilihan', desc: 'Kualitas Terbaik', icon: Star, color: 'text-orange-600' },
  { id: 4, label: 'Bayar Fleksibel', desc: 'Banyak Pilihan', icon: CreditCard, color: 'text-purple-600' },
];

export function TrustBadges() {
  return (
    <section className="px-4 py-8 bg-gray-50/50">
      <div className="text-center mb-6">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Kenapa Belanja di MarPay?</h2>
        <div className="w-10 h-1 bg-primary mx-auto mt-2 rounded-full opacity-30"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((badge) => (
          <div key={badge.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className={badge.color}>
              <badge.icon className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-800 uppercase leading-tight">{badge.label}</h4>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">MarPay Marketplace v1.0.5</p>
      </div>
    </section>
  );
}
