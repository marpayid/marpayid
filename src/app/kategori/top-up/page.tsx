'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Zap, Wallet, Wifi, ReceiptText, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TopUpPage() {
  const router = useRouter();

  const services = [
    { id: 'pulsa', name: 'PULSA', icon: Smartphone, active: true },
    { id: 'paket-data', name: 'PAKET DATA', icon: Wifi, active: false, badge: 'COMING SOON' },
    { id: 'token-pln', name: 'TOKEN PLN', icon: Zap, active: true },
    { id: 'e-wallet', name: 'E-WALLET', icon: Wallet, active: true },
    { id: 'pln-pasca', name: 'PLN PASCABAYAR', icon: ReceiptText, active: false, badge: 'COMING SOON' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Top Up</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Subtitle Section */}
        <div className="mb-5 px-1">
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Pilih layanan top up dan pembayaran digital MarPay.</p>
        </div>

        {/* Services Grid - Matched with PPOB Proportions */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <div 
              key={service.id}
              className={cn(
                "relative bg-white p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all shadow-sm h-28 text-center overflow-hidden",
                service.active 
                  ? "border-gray-100 active:scale-95 cursor-pointer hover:bg-gray-50" 
                  : "border-gray-100 opacity-60 grayscale cursor-not-allowed bg-gray-50/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                service.active ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
              )}>
                <service.icon className="w-5 h-5 stroke-[2px]" />
              </div>
              <span className="text-[9px] font-bold text-gray-700 tracking-tight leading-tight uppercase">
                {service.name}
              </span>
              
              {service.badge && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="bg-gray-100 text-gray-500 text-[6px] font-black px-1.5 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
                    {service.badge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature Highlights - Compact & Premium */}
        <div className="mt-6 space-y-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-[11px] font-bold text-gray-900">Transaksi Aman & Terpercaya</h3>
                <p className="text-[9px] text-gray-500 mt-0.5">Sistem keamanan berlapis untuk setiap transaksi.</p>
             </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <Clock className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-[11px] font-bold text-gray-900">Proses Cepat 24 Jam</h3>
                <p className="text-[9px] text-gray-500 mt-0.5">Otomatisasi sistem untuk layanan instan nonstop.</p>
             </div>
          </div>
        </div>

        {/* Promo Banner - Slightly Reduced Height */}
        <div className="mt-6 relative rounded-2xl overflow-hidden h-28 bg-gradient-to-r from-primary to-emerald-600 p-5 flex flex-col justify-center text-white shadow-lg shadow-primary/20">
           <Zap className="absolute right-[-10px] top-[-10px] w-28 h-28 text-white/10 rotate-12" />
           <p className="text-[8px] font-bold uppercase tracking-widest opacity-80 mb-1">PROMO HARI INI</p>
           <h2 className="text-base font-bold leading-tight mb-2">Cashback s/d Rp5.000<br/>Setiap Top Up Digital</h2>
           <div className="flex">
              <span className="bg-white/20 backdrop-blur-md text-[7px] font-bold px-2 py-0.5 rounded-full border border-white/20 uppercase">
                Gunakan Kode: TOPUPHEMAT
              </span>
           </div>
        </div>
      </main>
    </div>
  );
}
