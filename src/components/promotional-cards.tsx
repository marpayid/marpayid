
'use client';

import { Gamepad2, Smartphone, Wallet, ShieldCheck, Zap, Clock, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function PromotionalCards() {
  return (
    <section className="px-4 space-y-4 my-8">
      {/* 1. Fashion Recommendation Card (Shopee Style) */}
      <Link href="/kategori/fashion" className="block">
        <div className="relative overflow-hidden rounded-[20px] bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between group active:scale-[0.98] transition-all">
          <div className="flex-1 z-10 space-y-2.5">
            <span className="inline-block bg-orange-50 text-orange-600 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-orange-100">
              FASHION TREND
            </span>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Koleksi Fashion Pilihan
              </h3>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[200px]">
                Kaos Oversized, Kemeja Premium dan Fashion Casual
              </p>
            </div>
            <div className="pt-1">
              <p className="text-xs font-bold text-gray-800 mb-2.5">Harga mulai <span className="text-primary text-sm font-black">Rp49.000</span></p>
              <div className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-primary/20">
                Lihat Koleksi
              </div>
            </div>
          </div>
          <div className="relative w-28 h-28 shrink-0">
             <div className="absolute -inset-2 bg-gray-50 rounded-full blur-2xl opacity-60"></div>
             <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="https://picsum.photos/seed/fashion-promo/400/400" 
                  alt="Koleksi Fashion" 
                  fill 
                  className="object-cover"
                  data-ai-hint="fashion clothes"
                />
             </div>
          </div>
        </div>
      </Link>

      {/* 2. Card Top Up Game */}
      <Link href="/kategori/top-up" className="block">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 shadow-xl shadow-indigo-500/20 text-white group active:scale-[0.98] transition-all">
          
          {/* Background 3D Visual Effect */}
          <div className="absolute -right-6 -bottom-6 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
            <Gamepad2 className="w-44 h-44 rotate-12" />
          </div>
          <div className="absolute right-10 top-0 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                PROSES INSTAN
              </span>
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                24 JAM NONSTOP
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black leading-tight tracking-tight">
                Top Up Game Termurah
              </h3>
              <p className="text-xs text-white/80 font-medium">
                MLBB • Free Fire • PUBG • Roblox
              </p>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-black/10">
                Cek Sekarang <Zap className="w-3 h-3 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 3. Card Pulsa & E-Wallet */}
      <Link href="/kategori/top-up/e-wallet" className="block">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 p-6 shadow-xl shadow-emerald-500/20 text-white group active:scale-[0.98] transition-all">
          
          {/* Background 3D Visual Effect */}
          <div className="absolute -right-8 -bottom-8 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
            <div className="relative">
              <Smartphone className="w-48 h-48 -rotate-12" />
              <Wallet className="absolute top-1/2 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 opacity-50" />
            </div>
          </div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-20 bg-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> AMAN & TERPERCAYA
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black leading-tight tracking-tight">
                Pulsa & E-Wallet Proses Cepat
              </h3>
              <p className="text-xs text-white/80 font-medium">
                DANA • OVO • GoPay • ShopeePay
              </p>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-black/10">
                Top Up Sekarang <Clock className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
