'use client';

import { Gamepad2, Smartphone, Wallet, ShieldCheck, Zap, Clock } from 'lucide-react';
import { cn, getProductImage } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Products } from '@/app/lib/dummy-data';

export function PromotionalCards() {
  // Ambil produk fashion spesifik untuk thumbnail di kartu
  const fashionThumbs = Products.filter(p => 
    ['Benidson Oversized Tshirt Benstylish', 
     'Wispie Money Magnet Fitted Shirt', 
     'Rephatious T-shirt "Rpts412"'].includes(p.name)
  ).slice(0, 3);

  return (
    <section className="px-4 space-y-4 my-8">
      {/* 1. Fashion Recommendation Card (Shopee Style) - Vertical Stacked Thumbnails */}
      <Link href="/kategori/fashion" className="block">
        <div className="relative overflow-hidden rounded-[20px] bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-stretch min-h-[170px] max-h-[190px] group active:scale-[0.98] transition-all">
          {/* Left Side: Content */}
          <div className="flex-1 p-5 flex flex-col justify-center space-y-2">
            <div className="inline-flex">
              <span className="bg-[#E6F6EF] text-[#00A859] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-[#D1F0E0]">
                FASHION TREND
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[15px] font-black text-gray-900 leading-tight">
                Koleksi Fashion Pilihan
              </h3>
              <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2">
                Kaos Oversized, Kemeja Premium dan Fashion Casual
              </p>
            </div>
            <div className="pt-1">
              <p className="text-[11px] font-bold text-gray-800">
                Mulai <span className="text-[#00A859] text-sm font-black">Rp49.000</span>
              </p>
              <button className="mt-2 bg-[#00A859] text-white px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase shadow-sm active:scale-95 transition-transform">
                Lihat Koleksi
              </button>
            </div>
          </div>

          {/* Right Side: Product Thumbnails Stacked Vertically */}
          <div className="w-[100px] bg-gray-50/30 p-2 flex flex-col gap-1.5 justify-center items-center">
            {fashionThumbs.map((product) => (
              <div 
                key={product.id} 
                className="relative w-full h-[52px] rounded-[12px] overflow-hidden border border-white shadow-sm bg-white shrink-0"
              >
                <Image 
                  src={getProductImage(product)} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
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
