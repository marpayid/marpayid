
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Crown, ShieldCheck, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import { BottomNav } from '@/components/bottom-nav';

export default function PremiumCategoryPage() {
  const router = useRouter();
  
  // Ambil hanya produk dengan kategori Premium
  const premiumProducts = Products.filter(p => p.category === 'Premium');

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Premium Apps</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Banner Hero */}
        <div className="relative rounded-[28px] overflow-hidden h-40 bg-gradient-to-br from-[#FFD700] via-[#FDB813] to-[#E5A000] p-6 flex flex-col justify-center text-white shadow-xl shadow-yellow-500/20 mb-6">
           <Crown className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/20 rotate-12" />
           <div className="relative z-10">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 mb-1.5">Layanan Eksklusif</p>
             <h2 className="text-2xl font-black leading-tight mb-2">Upgrade Akun<br/>Premium Instan</h2>
             <div className="flex gap-2">
                <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase">Aman</span>
                <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase">Cepat</span>
                <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase">Garansi</span>
             </div>
           </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
            Pilih aplikasi premium favoritmu. Akun akan diproses secara instan setelah pembayaran dikonfirmasi melalui WhatsApp admin MarPay.
          </p>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Katalog Premium</h3>
            <span className="text-[10px] font-bold text-gray-400">{premiumProducts.length} Produk</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {premiumProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xs font-bold text-gray-900">Legal & Full Garansi</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Semua akun premium kami legal dan memiliki garansi penuh sesuai durasi.</p>
             </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xs font-bold text-gray-900">Aktivasi Instan</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Setelah konfirmasi pembayaran, akun langsung kami berikan tanpa menunggu lama.</p>
             </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
