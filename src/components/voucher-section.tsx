'use client';

import { useState } from 'react';
import { Ticket, Truck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Vouchers } from '@/app/lib/dummy-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as LucideIcons from 'lucide-react';

export function VoucherSection() {
  const { toast } = useToast();
  const [claimedId, setClaimedId] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  const handleClaim = (id: number, title: string) => {
    setClaimedId(id);
    toast({
      title: "Voucher Diklaim!",
      description: `${title} berhasil disimpan ke akun Anda.`,
      duration: 3000,
    });
  };

  const openTerms = (v: any) => {
    setSelectedVoucher(v);
    setShowTerms(true);
  };

  return (
    <section className="px-4 py-4 bg-white border-y border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900">Voucher Spesial Untukmu</h2>
        <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Terbatas</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {Vouchers.map((v) => {
          const IconComponent = (LucideIcons as any)[v.icon] || Ticket;
          
          return (
            <div 
              key={v.id} 
              className={cn(
                "relative flex-shrink-0 w-[260px] h-[95px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex transition-all",
                !v.active && "grayscale opacity-60"
              )}
            >
              {/* Left side (Icon Section) */}
              <div className={cn("w-20 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-100 relative", v.color, v.bgColor)}>
                <IconComponent className="w-7 h-7" />
                <span className="text-[7px] font-black uppercase text-center leading-none px-1">{v.badge.replace('🚚 ', '').replace('🎟️ ', '')}</span>
                
                {/* Dashed line cutouts */}
                <div className="absolute top-[-6px] right-[-6.5px] w-3 h-3 bg-white rounded-full border border-gray-100 z-10 shadow-inner"></div>
                <div className="absolute bottom-[-6px] right-[-6.5px] w-3 h-3 bg-white rounded-full border border-gray-100 z-10 shadow-inner"></div>
              </div>

              {/* Center side (Main Info) */}
              <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                   <h4 className="text-[9px] font-bold text-gray-400 truncate uppercase">{v.title}</h4>
                   <button onClick={() => openTerms(v)} className="p-1 text-gray-300 hover:text-primary shrink-0">
                      <Info className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-[13px] font-black text-gray-900 leading-tight truncate">{v.benefit}</p>
                <div className="flex items-center gap-1 mt-1">
                   <span className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{v.minSpend}</span>
                </div>
              </div>

              {/* Right side (Action) */}
              <div className="w-16 flex items-center justify-center pr-2">
                <button 
                  disabled={!v.active || claimedId === v.id}
                  onClick={() => handleClaim(v.id, v.title)}
                  className={cn(
                    "text-[10px] font-black uppercase transition-all px-2 py-1.5 rounded-lg",
                    claimedId === v.id 
                      ? "text-green-600 bg-green-50" 
                      : "text-white bg-primary shadow-sm active:scale-95"
                  )}
                >
                  {claimedId === v.id ? 'Siap' : 'Klaim'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-[425px] rounded-[28px]">
          <DialogHeader>
            <DialogTitle className="text-center font-black text-lg">Syarat & Ketentuan</DialogTitle>
          </DialogHeader>
          {selectedVoucher && (
            <div className="py-2 space-y-4">
               <div className={cn("p-4 rounded-2xl border", selectedVoucher.bgColor, selectedVoucher.borderColor || "border-primary/10")}>
                  <h5 className={cn("text-xs font-bold uppercase tracking-widest mb-2", selectedVoucher.color)}>Benefit Voucher</h5>
                  <p className="text-base font-black text-gray-800">{selectedVoucher.benefit}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Gunakan kode: <span className={cn("font-bold px-1.5 py-0.5 rounded bg-white/80 border border-current/10 ml-1", selectedVoucher.color)}>{selectedVoucher.code}</span></p>
               </div>
               <ul className="space-y-2.5 px-1">
                  {[
                    selectedVoucher.type === 'shipping' ? 'Khusus untuk produk fisik MarPay.' : 'Berlaku untuk seluruh produk di MarPay.',
                    `Minimal transaksi belanja ${selectedVoucher.minSpend}.`,
                    `Potongan harga maksimal senilai ${selectedVoucher.benefit}.`,
                    'Satu akun maksimal 1 kali klaim per hari.',
                    'Voucher memiliki kuota harian terbatas.',
                    `Masa berlaku hingga ${selectedVoucher.expiry}.`
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5", selectedVoucher.color.replace('text-', 'bg-'))} />
                      <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{item}</p>
                    </li>
                  ))}
               </ul>
            </div>
          )}
          <Button onClick={() => setShowTerms(false)} className="w-full bg-primary text-white font-bold h-12 rounded-2xl mt-4">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
