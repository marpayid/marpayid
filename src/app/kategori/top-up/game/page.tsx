
'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Gamepad2, ShieldCheck, Zap, Clock, TrendingUp, 
  Smartphone, Swords, Trophy, Ghost
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const GAMES = [
  { id: 'mlbb', name: 'Mobile Legends', icon: Swords, slug: 'mobile-legends', color: 'bg-blue-500', active: true },
  { id: 'ff', name: 'Free Fire', icon: Trophy, slug: 'free-fire', color: 'bg-orange-500', active: true },
  { id: 'pubgm', name: 'PUBG Mobile', icon: Smartphone, slug: 'pubg-mobile', color: 'bg-emerald-500', active: true },
  { id: 'roblox', name: 'Roblox', icon: Ghost, slug: 'roblox', color: 'bg-red-500', active: true },
  { id: 'valorant', name: 'Valorant', icon: Swords, slug: 'valorant', color: 'bg-rose-500', active: false },
  { id: 'hok', name: 'Honor of Kings', icon: Trophy, slug: 'honor-of-kings', color: 'bg-indigo-500', active: false },
  { id: 'genshin', name: 'Genshin Impact', icon: Zap, slug: 'genshin-impact', color: 'bg-purple-500', active: false },
  { id: 'fc', name: 'FC Mobile', icon: Trophy, slug: 'fc-mobile', color: 'bg-green-600', active: false },
];

export default function TopUpGamePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleComingSoon = (gameName: string) => {
    toast({
      title: "Coming Soon",
      description: `Top Up ${gameName} akan segera tersedia di MarPay.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up Game</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Banner Gaming */}
        <div className="relative rounded-[28px] overflow-hidden h-44 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 shadow-xl shadow-indigo-500/20 mb-8 border border-white/10">
           <Gamepad2 className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/10 rotate-12" />
           <div className="relative z-10">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 mb-1.5">PROMO TERBATAS</p>
             <h2 className="text-2xl font-black leading-tight mb-2">TOP UP GAME<br/>TERMURAH</h2>
             <div className="flex gap-2">
                <span className="bg-white/10 backdrop-blur-md text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase">MLBB</span>
                <span className="bg-white/10 backdrop-blur-md text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase">FF</span>
                <span className="bg-white/10 backdrop-blur-md text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase">PUBG</span>
             </div>
           </div>
        </div>

        {/* Game Populer Grid */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-1">
             <TrendingUp className="w-4 h-4 text-cyan-400" />
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Pilih Game</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-y-6 gap-x-3">
             {GAMES.map((game) => {
               const content = (
                 <div className="flex flex-col items-center gap-2 group relative">
                   <div className={cn(
                     "w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 group-active:scale-90 border border-white/10 shadow-lg",
                     game.color,
                     !game.active && "grayscale opacity-50"
                   )}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <game.icon className="w-7 h-7 text-white relative z-10" />
                      
                      {!game.active && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="bg-black/60 text-[6px] font-black text-white px-1 py-0.5 rounded-sm uppercase tracking-tighter">SOON</span>
                        </div>
                      )}
                   </div>
                   <span className={cn(
                     "text-[9px] font-bold text-center leading-tight uppercase tracking-tighter transition-colors",
                     game.active ? "text-gray-300 group-hover:text-white" : "text-gray-500"
                   )}>
                     {game.name}
                   </span>
                 </div>
               );

               return game.active ? (
                 <Link key={game.id} href={`/kategori/top-up/game/${game.slug}`}>
                   {content}
                 </Link>
               ) : (
                 <button key={game.id} onClick={() => handleComingSoon(game.name)}>
                   {content}
                 </button>
               );
             })}
          </div>
        </section>

        {/* Features Highlights */}
        <section className="space-y-3 pt-4">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Kenapa Top Up di MarPay?</h3>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                 <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                    <Zap className="w-5 h-5 fill-current" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold">Proses Instan</h4>
                    <p className="text-[8px] text-gray-500 mt-1">Diamond masuk dalam hitungan detik.</p>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                 <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold">Aman & Legal</h4>
                    <p className="text-[8px] text-gray-500 mt-1">Metode resmi & anti-banned.</p>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                 <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400">
                    <Clock className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold">24 Jam</h4>
                    <p className="text-[8px] text-gray-500 mt-1">Layanan otomatis nonstop setiap hari.</p>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                 <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                    <Trophy className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold">Harga Terbaik</h4>
                    <p className="text-[8px] text-gray-500 mt-1">Termurah dibanding kompetitor.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
