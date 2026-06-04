"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, Truck, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Vouchers } from '@/app/lib/dummy-data';
import * as LucideIcons from 'lucide-react';

export default function MyVouchersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  const [claimedIds, setClaimedIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('marpay_claimed_vouchers');
    if (saved) {
      try {
        setClaimedIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const isExpired = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > expiry;
  };

  const handleUseVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Kode Disalin!",
      description: `Gunakan kode ${code} saat checkout.`,
      duration: 2000,
    });
    router.push('/');
  };

  // Only show vouchers that are claimed AND not expired in 'available'
  // Vouchers that are claimed BUT expired go to 'history'
  const availableVouchers = Vouchers.filter(v => claimedIds.includes(v.id) && !isExpired(v.expiryDate));
  const historyVouchers = Vouchers.filter(v => claimedIds.includes(v.id) && isExpired(v.expiryDate));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Voucher Saya</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 mb-6 shadow-sm">
           <button 
             onClick={() => setActiveTab('available')}
             className={cn(
               "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'available' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400"
             )}
           >
             Tersedia ({availableVouchers.length})
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={cn(
               "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'history' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400"
             )}
           >
             Riwayat ({historyVouchers.length})
           </button>
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-3">
            {availableVouchers.length > 0 ? (
              availableVouchers.map((v) => {
                const IconComponent = (LucideIcons as any)[v.icon] || Ticket;
                
                return (
                  <div key={v.id} className="relative bg-white h-[100px] rounded-xl border border-gray-100 shadow-sm overflow-hidden flex transition-all">
                    <div className={cn("w-20 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-100 relative", v.color, v.bgColor)}>
                      <IconComponent className="w-7 h-7" />
                      <span className="text-[7px] font-black uppercase text-center leading-none px-1">{v.badge.replace('🚚 ', '').replace('🎟️ ', '')}</span>
                      <div className="absolute top-[-6px] right-[-6.5px] w-3.5 h-3.5 bg-gray-50 rounded-full border border-gray-100 z-10"></div>
                      <div className="absolute bottom-[-6px] right-[-6.5px] w-3.5 h-3.5 bg-gray-50 rounded-full border border-gray-100 z-10"></div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{v.title}</h3>
                      <p className="text-sm font-black text-gray-900 leading-tight mt-0.5">{v.benefit}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[8px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{v.minSpend}</span>
                        <span className="text-[8px] font-bold text-primary italic">Valid s/d {v.expiry}</span>
                      </div>
                    </div>
                    <div className="w-20 flex items-center justify-center p-2">
                      <button 
                        onClick={() => handleUseVoucher(v.code)}
                        className="w-full h-14 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        Pakai
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Ticket className="w-10 h-10 mb-2" />
                <p className="text-xs font-bold">Belum ada voucher aktif</p>
                <p className="text-[10px]">Silakan klaim voucher di halaman beranda.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {historyVouchers.length > 0 ? (
              historyVouchers.map((v) => {
                const IconComponent = (LucideIcons as any)[v.icon] || Ticket;
                return (
                  <div key={v.id} className="relative bg-white h-[100px] rounded-xl border border-gray-100 shadow-sm overflow-hidden flex transition-all grayscale opacity-60">
                    <div className={cn("w-20 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-100 relative", v.color, v.bgColor)}>
                      <IconComponent className="w-7 h-7" />
                      <span className="text-[7px] font-black uppercase text-center leading-none px-1">{v.badge.replace('🚚 ', '').replace('🎟️ ', '')}</span>
                      <div className="absolute top-[-6px] right-[-6.5px] w-3.5 h-3.5 bg-gray-50 rounded-full border border-gray-100 z-10"></div>
                      <div className="absolute bottom-[-6px] right-[-6.5px] w-3.5 h-3.5 bg-gray-50 rounded-full border border-gray-100 z-10"></div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{v.title}</h3>
                      <p className="text-sm font-black text-gray-900 leading-tight mt-0.5">{v.benefit}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[8px] font-bold text-red-500 uppercase">Kadaluarsa</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
                  <Ticket className="w-10 h-10" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Belum ada riwayat voucher</h3>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
                  Voucher yang telah kadaluarsa akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
