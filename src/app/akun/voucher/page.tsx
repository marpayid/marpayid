"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, Truck, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MyVouchersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');

  const vouchers = [
    {
      id: 101,
      title: 'GRATIS ONGKIR MARPAY',
      description: 'Gratis Ongkir hingga Rp15.000',
      benefit: 'Potongan Rp15rb',
      minSpend: 'Min. blj Rp50rb',
      expiry: 'Valid s/d 31 Des 2026',
      code: 'ONGKIRMARPAY',
      type: 'shipping',
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/10'
    },
    {
      id: 102,
      title: 'NEW USER SPECIAL',
      description: 'Diskon 10% untuk pengguna baru',
      benefit: 'Diskon 10%',
      minSpend: 'Tanpa Min. Belanja',
      expiry: 'Valid s/d 31 Des 2025',
      code: 'MARPAYBARU',
      type: 'discount',
      icon: Ticket,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100'
    }
  ];

  const handleUseVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Kode Disalin!",
      description: `Gunakan kode ${code} saat checkout.`,
      duration: 2000,
    });
    router.push('/');
  };

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
             Tersedia (2)
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={cn(
               "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'history' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400"
             )}
           >
             Riwayat
           </button>
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-4">
            {vouchers.map((v) => (
              <div key={v.id} className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                <div className="p-5 flex gap-4">
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", v.bgColor, v.color)}>
                      <v.icon className="w-7 h-7" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{v.title}</h3>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">{v.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                         <span className="bg-gray-50 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded border border-gray-100 uppercase">{v.minSpend}</span>
                         <span className="bg-gray-50 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded border border-gray-100 uppercase">{v.benefit}</span>
                      </div>
                   </div>
                </div>
                
                <div className="px-5 py-3 bg-gray-50/50 border-t border-dashed border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 italic">
                      <AlertCircle className="w-3 h-3" />
                      {v.expiry}
                   </div>
                   <button 
                    onClick={() => handleUseVoucher(v.code)}
                    className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline uppercase"
                   >
                     Gunakan <ChevronRight className="w-3 h-3" />
                   </button>
                </div>

                {/* Ticket Cutouts */}
                <div className="absolute top-1/2 -translate-y-1/2 left-[-10px] w-5 h-5 bg-gray-50 rounded-full border border-gray-100 z-10 shadow-inner"></div>
                <div className="absolute top-1/2 -translate-y-1/2 right-[-10px] w-5 h-5 bg-gray-50 rounded-full border border-gray-100 z-10 shadow-inner"></div>
              </div>
            ))}
            
            <div className="pt-6 text-center">
               <p className="text-[10px] text-gray-400 font-medium">Anda telah melihat semua voucher tersedia.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <Ticket className="w-12 h-12" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Belum ada riwayat voucher</h3>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
              Voucher yang telah kadaluarsa atau digunakan akan muncul di sini.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
