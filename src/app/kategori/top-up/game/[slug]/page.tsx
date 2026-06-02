
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Swords, Trophy, Smartphone, Ghost, Zap, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NOMINALS = [
  { id: 1, label: '86 Diamond', price: 19500 },
  { id: 2, label: '172 Diamond', price: 38800 },
  { id: 3, label: '257 Diamond', price: 58500 },
  { id: 4, label: '344 Diamond', price: 77500 },
  { id: 5, label: '429 Diamond', price: 96900 },
  { id: 6, label: '514 Diamond', price: 116000 },
  { id: 7, label: '706 Diamond', price: 155000 },
  { id: 8, label: '1050 Diamond', price: 232000 },
];

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const gameInfo = useMemo(() => {
    const name = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    let icon = Swords;
    let color = 'bg-blue-600';

    if (slug === 'free-fire') { icon = Trophy; color = 'bg-orange-500'; }
    if (slug === 'pubg-mobile') { icon = Smartphone; color = 'bg-emerald-500'; }
    if (slug === 'roblox') { icon = Ghost; color = 'bg-red-500'; }

    return { name, icon, color };
  }, [slug]);

  const handleCheckout = () => {
    if (!userId || !selectedId) return;

    const nominal = NOMINALS.find(n => n.id === selectedId);
    if (!nominal) return;

    const digitalItem = {
      id: `GAME-${slug}-${nominal.id}`,
      name: `${gameInfo.name} - ${nominal.label}`,
      price: nominal.price,
      image: '/game-icon.png',
      variant: `ID: ${userId}${zoneId ? ` (${zoneId})` : ''}`,
      quantity: 1,
      type: 'digital',
      shippingFee: 0,
      details: {
        target: userId,
        operator: gameInfo.name,
        nominal: nominal.label,
        zoneId: zoneId
      }
    };

    localStorage.setItem('marpay_checkout_temp', JSON.stringify([digitalItem]));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up {gameInfo.name}</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Info Game */}
        <section className="bg-white/5 rounded-3xl border border-white/5 p-6 flex items-center gap-5">
           <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-2xl", gameInfo.color)}>
              <gameInfo.icon className="w-10 h-10 text-white" />
           </div>
           <div>
              <h2 className="text-xl font-black">{gameInfo.name}</h2>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Proses Instan 24 Jam</p>
           </div>
        </section>

        {/* Step 1: Input ID */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black">1</div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Lengkapi Data</h3>
           </div>
           <div className="bg-white/5 rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                 <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">User ID</label>
                    <Input 
                      placeholder="Masukkan ID" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600" 
                    />
                 </div>
                 {slug === 'mobile-legends' && (
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Zone</label>
                      <Input 
                        placeholder="1234" 
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-cyan-500/50 text-white placeholder:text-gray-600 text-center" 
                      />
                   </div>
                 )}
              </div>
              <div className="flex gap-2 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                 <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                 <p className="text-[9px] text-cyan-200 leading-normal">
                   Pastikan User ID dan Zone ID sudah benar. Kesalahan input bukan tanggung jawab kami.
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
              {NOMINALS.map((nom) => (
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
                        <p className="text-xs font-black group-hover:text-cyan-300 transition-colors">{nom.label}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5">Rp {nom.price.toLocaleString()}</p>
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
      {selectedId && userId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between z-50 animate-in slide-in-from-bottom-full duration-300">
           <div className="flex flex-col">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Bayar</p>
              <p className="text-xl font-black text-cyan-400">Rp {NOMINALS.find(n => n.id === selectedId)?.price.toLocaleString()}</p>
           </div>
           <Button onClick={handleCheckout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black h-12 px-10 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2">
              BELI SEKARANG <Zap className="w-4 h-4 fill-current" />
           </Button>
        </div>
      )}
    </div>
  );
}
