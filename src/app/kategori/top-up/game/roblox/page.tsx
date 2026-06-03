
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ghost, Zap, Info, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ROBLOX_PRODUCTS = [
  { id: 1, label: '800 Robux', price: 164999 },
  { id: 2, label: '2000 Robux', price: 404999 },
  { id: 3, label: '4500 Robux', price: 859999 },
  { id: 4, label: '10000 Robux', price: 1809999 },
];

export default function RobloxPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCheckout = () => {
    if (!username || !selectedId) return;

    const product = ROBLOX_PRODUCTS.find(p => p.id === selectedId);
    if (!product) return;

    const adminWhatsApp = "6283851278935";
    const message = `Halo Admin MarPay\n\nGame: Roblox\nUsername: ${username}\nNominal: ${product.label}\nHarga: Rp ${product.price.toLocaleString()}\n\nSaya ingin membeli Robux.`;
    
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up Roblox</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Banner Game Info */}
        <section className="bg-white/5 rounded-3xl border border-white/5 p-6 flex items-center gap-5 shadow-2xl relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 blur-2xl rounded-full"></div>
           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
              <Ghost className="w-10 h-10 text-white" />
           </div>
           <div className="relative z-10">
              <h2 className="text-xl font-black italic tracking-tighter uppercase">Roblox</h2>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Roblox Corp • Proses 24 Jam</p>
           </div>
        </section>

        {/* Step 1: Input Username */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black shadow-lg shadow-cyan-500/20">1</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Lengkapi Data Akun</h3>
           </div>
           <div className="bg-white/5 rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Username Roblox</label>
                 <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <Input 
                     placeholder="Masukkan Username" 
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600 pl-10 text-lg font-bold" 
                   />
                 </div>
              </div>
              <div className="flex gap-3 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                 <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-cyan-200 leading-normal font-medium">
                   Pastikan username sudah benar. Kesalahan penulisan username bukan tanggung jawab MarPay.
                 </p>
              </div>
           </div>
        </section>

        {/* Step 2: Pilih Nominal */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black shadow-lg shadow-cyan-500/20">2</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Pilih Nominal Robux</h3>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {ROBLOX_PRODUCTS.map((nom) => (
                <button
                  key={nom.id}
                  onClick={() => setSelectedId(nom.id)}
                  className={cn(
                    "relative p-4 rounded-2xl border transition-all text-left group overflow-hidden h-28 flex flex-col justify-center",
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
                        <p className="text-xs font-black group-hover:text-cyan-300 transition-colors leading-tight uppercase">{nom.label}</p>
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
        <section className="pt-4 pb-10">
          <Button 
            variant="outline" 
            onClick={() => window.open(`https://wa.me/6283851278935?text=${encodeURIComponent('Halo Admin MarPay, saya ingin bertanya tentang top up Roblox.')}`, '_blank')}
            className="w-full border-green-500/30 bg-green-500/5 text-green-500 font-bold h-12 rounded-xl flex items-center gap-2 hover:bg-green-500/10"
          >
            <MessageCircle className="w-4 h-4" />
            Ada Kendala? Hubungi Admin
          </Button>
        </section>
      </main>

      {/* Floating Checkout Button */}
      {selectedId && username && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between z-50 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
           <div className="flex flex-col">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-xl font-black text-cyan-400">Rp {ROBLOX_PRODUCTS.find(n => n.id === selectedId)?.price.toLocaleString()}</p>
           </div>
           <Button onClick={handleCheckout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black h-12 px-10 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2">
              BELI SEKARANG <Zap className="w-4 h-4 fill-current" />
           </Button>
        </div>
      )}
    </div>
  );
}
