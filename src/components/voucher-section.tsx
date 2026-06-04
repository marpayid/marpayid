'use client';

import { useState } from 'react';
import { Ticket, Truck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VoucherSection() {
  const { toast } = useToast();
  const [claimedId, setClaimedId] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  const vouchers = [
    {
      id: 101,
      title: 'GRATIS ONGKIR MARPAY',
      description: 'Gratis Ongkir hingga Rp15.000',
      info: 'Min. blj Rp50.000',
      icon: Truck,
      color: 'bg-primary/10',
      textColor: 'text-primary',
      badge: '🚚 Gratis Ongkir',
      active: true,
      code: 'ONGKIRMARPAY',
      expiry: '31 Des 2026'
    },
    {
      id: 1,
      title: 'Voucher Belanja',
      description: 'Diskon hingga Rp20.000',
      info: 'Kuota telah habis',
      icon: Ticket,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
      badge: 'Habis',
      active: false
    },
  ];

  const handleClaim = (id: number, title: string) => {
    setClaimedId(id);
    toast({
      title: "Voucher Diklaim!",
      description: `${title} berhasil disimpan ke akun Anda.`,
      duration: 3000,
    });
  };

  return (
    <section className="px-4 py-6 bg-white border-y border-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Voucher Spesial Untukmu</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TERBATAS</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {vouchers.map((v) => (
          <div 
            key={v.id} 
            className={cn(
              "relative flex-shrink-0 w-[280px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex group transition-all",
              !v.active && "grayscale opacity-60"
            )}
          >
            {/* Left side (Icon) */}
            <div className={cn("w-24 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-100", v.color)}>
              <v.icon className={cn("w-8 h-8", v.textColor)} />
              <div className="bg-white/90 px-2 py-0.5 rounded-md shadow-sm">
                <span className={cn("text-[8px] font-black uppercase tracking-tighter whitespace-nowrap", v.textColor)}>{v.badge}</span>
              </div>
            </div>

            {/* Right side (Content) */}
            <div className="flex-1 p-3.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-[11px] font-black text-gray-900 leading-tight line-clamp-2">{v.title}</h4>
                  {v.active && (
                    <button onClick={() => setShowTerms(true)} className="p-1 -mt-1 text-gray-300 hover:text-primary">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 font-medium">{v.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-400">{v.info}</span>
                </div>
                <Button 
                  disabled={!v.active || claimedId === v.id}
                  onClick={() => handleClaim(v.id, v.title)}
                  size="sm" 
                  className={cn(
                    "h-8 px-4 rounded-xl text-[9px] font-black border-none uppercase transition-all",
                    claimedId === v.id ? "bg-green-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20 active:scale-95"
                  )}
                >
                  {claimedId === v.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : 'Klaim'}
                </Button>
              </div>
            </div>

            {/* Ticket Cutouts for Dashed Effect */}
            <div className="absolute top-[-10px] left-[91px] w-5 h-5 bg-white rounded-full border border-gray-50 z-10"></div>
            <div className="absolute bottom-[-10px] left-[91px] w-5 h-5 bg-white rounded-full border border-gray-50 z-10"></div>
          </div>
        ))}
      </div>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-center font-black text-lg">Syarat & Ketentuan</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Benefit</h5>
                <p className="text-sm font-black text-gray-800">Gratis Ongkir hingga Rp15.000</p>
                <p className="text-[10px] text-gray-500 mt-1">Kode Voucher: <span className="font-bold text-primary">ONGKIRMARPAY</span></p>
             </div>
             <ul className="space-y-2 px-1">
                {[
                  'Berlaku untuk produk fisik.',
                  'Minimal transaksi Rp50.000.',
                  'Potongan ongkir maksimal Rp15.000.',
                  'Tidak berlaku untuk produk digital, PPOB, dan Produk Premium.',
                  'Satu akun maksimal 1 kali penggunaan per hari.',
                  'Berlaku selama kuota masih tersedia.',
                  'Berlaku hingga 31 Desember 2026.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
             </ul>
          </div>
          <Button onClick={() => setShowTerms(false)} className="w-full bg-primary text-white font-bold h-12 rounded-2xl">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
