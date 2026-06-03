
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Swords, Zap, Info, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ML_PRODUCTS = [
  { id: 1, label: 'Weekly Diamond Pass', price: 27999 },
  { id: 2, label: '3 Diamond', price: 1499 },
  { id: 3, label: '5 Diamond', price: 1999 },
  { id: 4, label: '12 Diamond', price: 3999 },
  { id: 5, label: '59 Diamond', price: 15999 },
  { id: 6, label: '110 Diamond', price: 28999 },
  { id: 7, label: '277 Diamond', price: 73999 },
  { id: 8, label: '568 Diamond', price: 143999 },
  { id: 9, label: '750 Diamond', price: 201999 },
  { id: 10, label: '1168 Diamond', price: 286999 },
  { id: 11, label: 'Weekly Elite Pass', price: 42999 },
  { id: 12, label: 'Monthly Elite Pass', price: 76999 },
];

export default function MobileLegendsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCheckout = () => {
    if (!userId || !zoneId || !selectedId) return;

    const product = ML_PRODUCTS.find(p => p.id === selectedId);
    if (!product) return;

    const adminWhatsApp = "6283851278935";
    const message = `Halo Admin MarPay\n\nGame: Mobile Legends\nUser ID: ${userId}\nZone ID: ${zoneId}\nNominal: ${product.label}\nHarga: Rp ${product.price.toLocaleString()}\n\nSaya ingin melakukan top up.`;
    
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up Mobile Legends</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Info Game */}
        <section className="bg-white/5 rounded-3xl border border-white/5 p-6 flex items-center gap-5">
           <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 border border-white/10 shadow-2xl">
              <Swords className="w-10 h-10 text-white" />
           </div>
           <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase">Mobile Legends</h2>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Moonton • Proses Instan</p>
           </div>
        </section>

        {/* Step 1: Input ID */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black">1</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Masukkan User ID</h3>
           </div>
           <div className="bg-white/5 rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                 <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">User ID</label>
                    <Input 
                      placeholder="123456789" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Zone</label>
                    <Input 
                      placeholder="1234" 
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600 text-center" 
                    />
                 </div>
              </div>
              <div className="flex gap-2 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                 <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                 <p className="text-[9px] text-cyan-200 leading-normal">
                   Ketuk profil Anda untuk melihat ID. Format ID (Zone ID). Contoh: 12345678 (1234).
                 </p>
              </div>
           </div>
        </section>

        {/* Step 2: Pilih Nominal */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black">2</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Pilih Nominal</h3>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {ML_PRODUCTS.map((nom) => (
                <button
                  key={nom.id}
                  onClick={() => setSelectedId(nom.id)}
                  className={cn(
                    "relative p-4 rounded-2xl border transition-all text-left group overflow-hidden",
                    selectedId === nom.id 
                      ? "bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex flex-col gap-2 relative z-10">
                     <div className={cn(
                       "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                       selectedId === nom.id ? "bg-cyan-500 text-white" : "bg-white/10 text-cyan-400"
                     )}>
                        <Zap className="w-4 h-4 fill-current" />
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
      </main>

      {/* Floating Checkout Button */}
      {selectedId && userId && zoneId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between z-50 animate-in slide-in-from-bottom-full duration-300">
           <div className="flex flex-col">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-xl font-black text-cyan-400">Rp {ML_PRODUCTS.find(n => n.id === selectedId)?.price.toLocaleString()}</p>
           </div>
           <Button onClick={handleCheckout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black h-12 px-10 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2">
              BELI SEKARANG <Zap className="w-4 h-4 fill-current" />
           </Button>
        </div>
      )}
    </div>
  );
}
