
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Zap, Info, Smartphone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FF_PRODUCTS = [
  { id: 1, label: '5 Diamond', price: 2499 },
  { id: 2, label: '10 Diamond', price: 4499 },
  { id: 3, label: '20 Diamond', price: 8999 },
  { id: 4, label: '50 Diamond', price: 18999 },
  { id: 5, label: '70 Diamond', price: 26999 },
  { id: 6, label: '100 Diamond', price: 35999 },
  { id: 7, label: '140 Diamond', price: 48999 },
  { id: 8, label: '150 Diamond', price: 52999 },
  { id: 9, label: '210 Diamond', price: 70999 },
  { id: 10, label: '280 Diamond', price: 94999 },
  { id: 11, label: '355 Diamond', price: 120999 },
  { id: 12, label: '425 Diamond', price: 140999 },
  { id: 13, label: '495 Diamond', price: 170999 },
  { id: 14, label: '500 Diamond', price: 171999 },
  { id: 15, label: '720 Diamond', price: 240999 },
  { id: 16, label: '860 Diamond', price: 290999 },
  { id: 17, label: '1000 Diamond', price: 335999 },
  { id: 18, label: '1075 Diamond', price: 360999 },
  { id: 19, label: '1440 Diamond', price: 472999 },
  { id: 20, label: '1450 Diamond', price: 480999 },
  { id: 21, label: '2160 Diamond', price: 720999 },
  { id: 22, label: '2180 Diamond', price: 730999 },
  { id: 23, label: '7290 Diamond', price: 2400999 },
  { id: 24, label: '36500 Diamond', price: 12000999 },
  { id: 25, label: '73100 Diamond', price: 24000999 },
];

export default function FreeFirePage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCheckout = () => {
    if (!playerId || !selectedId) return;

    const product = FF_PRODUCTS.find(p => p.id === selectedId);
    if (!product) return;

    const adminWhatsApp = "6283851278935";
    const message = `Halo Admin MarPay\n\nGame: Free Fire\nPlayer ID: ${playerId}\nNominal: ${product.label}\nHarga: Rp ${product.price.toLocaleString()}\n\nSaya ingin melakukan top up Free Fire.`;
    
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContactWhatsApp = () => {
    const adminWhatsApp = "6283851278935";
    const message = `Halo Admin MarPay, saya ingin bertanya tentang Top Up Free Fire.`;
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up Free Fire</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Banner Game Info */}
        <section className="bg-white/5 rounded-3xl border border-white/5 p-6 flex items-center gap-5 shadow-2xl relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 blur-2xl rounded-full"></div>
           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
              <Trophy className="w-10 h-10 text-white" />
           </div>
           <div className="relative z-10">
              <h2 className="text-xl font-black italic tracking-tighter uppercase">Free Fire</h2>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Garena • Proses Instan 24 Jam</p>
           </div>
        </section>

        {/* Step 1: Input Player ID */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black shadow-lg shadow-cyan-500/20">1</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Lengkapi Data Akun</h3>
           </div>
           <div className="bg-white/5 rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Player ID</label>
                 <Input 
                   type="tel"
                   placeholder="Contoh: 12345678" 
                   value={playerId}
                   onChange={(e) => setPlayerId(e.target.value.replace(/[^0-9]/g, ''))}
                   className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600 text-lg font-bold" 
                 />
              </div>
              <div className="flex gap-3 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                 <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-cyan-200 leading-normal font-medium">
                   Untuk mengetahui Player ID Anda, silakan klik ikon profil di dalam game Free Fire Anda. Player ID tercantum di bawah nama karakter Anda.
                 </p>
              </div>
           </div>
        </section>

        {/* Step 2: Pilih Nominal */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black shadow-lg shadow-cyan-500/20">2</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Pilih Nominal Diamond</h3>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {FF_PRODUCTS.map((nom) => (
                <button
                  key={nom.id}
                  onClick={() => setSelectedId(nom.id)}
                  className={cn(
                    "relative p-4 rounded-2xl border transition-all text-left group overflow-hidden h-24 flex flex-col justify-center",
                    selectedId === nom.id 
                      ? "bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex flex-col gap-1 relative z-10">
                     <div className={cn(
                       "w-7 h-7 rounded-lg flex items-center justify-center mb-1 transition-colors",
                       selectedId === nom.id ? "bg-cyan-500 text-white" : "bg-white/10 text-cyan-400"
                     )}>
                        <Zap className={cn("w-3.5 h-3.5 fill-current", selectedId === nom.id && "animate-pulse")} />
                     </div>
                     <div>
                        <p className="text-xs font-black group-hover:text-cyan-300 transition-colors leading-tight">{nom.label}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-1">Rp {nom.price.toLocaleString()}</p>
                     </div>
                  </div>
                  {selectedId === nom.id && (
                    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-cyan-500/20 blur-xl rounded-full"></div>
                  )}
                </button>
              ))}
           </div>
        </section>

        {/* Section: Support */}
        <section className="pt-4">
          <Button 
            variant="outline" 
            onClick={handleContactWhatsApp}
            className="w-full border-green-500/30 bg-green-500/5 text-green-500 font-bold h-12 rounded-xl flex items-center gap-2 hover:bg-green-500/10"
          >
            <MessageCircle className="w-4 h-4" />
            Ada Kendala? Hubungi WhatsApp
          </Button>
        </section>
      </main>

      {/* Floating Checkout Button */}
      {selectedId && playerId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between z-50 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
           <div className="flex flex-col">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-xl font-black text-cyan-400">Rp {FF_PRODUCTS.find(n => n.id === selectedId)?.price.toLocaleString()}</p>
           </div>
           <Button onClick={handleCheckout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black h-12 px-10 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2">
              BELI SEKARANG <Zap className="w-4 h-4 fill-current" />
           </Button>
        </div>
      )}
    </div>
  );
}
