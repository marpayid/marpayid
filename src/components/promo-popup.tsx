
"use client"

import { useState, useEffect } from 'react';
import { X, Gift, Zap, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    /**
     * MODE TESTING:
     * Popup akan muncul setiap kali halaman dibuka/direfresh.
     * Tidak menyimpan status ke localStorage agar memudahkan pengecekan desain.
     */
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500); // Muncul setelah 1.5 detik agar transisi halus

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    // Simulasi klaim
    handleClose();
    window.location.href = '/akun/voucher';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/30 animate-in fade-in duration-500">
      <div className="relative w-full max-w-[270px] animate-in zoom-in-95 duration-500">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={handleClose}
          className="absolute -top-9 right-0 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 text-white flex flex-col items-center text-center px-6 py-4">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          {/* Header Visual */}
          <div className="relative z-10 mb-2.5 flex flex-col items-center">
             <div className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20 mb-2 animate-bounce">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  PROMO SPESIAL
                </p>
             </div>
             
             {/* Logo MarPay - profil1.png */}
             <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-xl overflow-hidden shadow-lg bg-white relative">
                   <Image 
                     src="/profil1.png" 
                     alt="MarPay Logo" 
                     fill
                     className="object-cover"
                     priority
                   />
                </div>
                <span className="text-lg font-black tracking-tighter">MarPay</span>
             </div>
          </div>

          {/* Body Text */}
          <div className="relative z-10 space-y-1 mb-3.5">
             <h2 className="text-xl font-black leading-[1.1] tracking-tight">
               VOUCHER<br/>PENGGUNA BARU
             </h2>
             <div className="w-8 h-0.5 bg-yellow-400 mx-auto rounded-full opacity-50 my-1.5"></div>
             <p className="text-[13px] font-medium text-white/80 leading-snug">
               Diskon <span className="text-yellow-400 font-black">Rp10.000</span> untuk<br/>minimal belanja Rp50.000
             </p>
          </div>

          {/* Illustration Section */}
          <div className="relative z-10 mb-3.5 w-full flex justify-center">
             <div className="relative animate-float">
                <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-[20px] border border-white/20 shadow-2xl relative overflow-hidden">
                   <Gift className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
                   <div className="absolute -right-1.5 -bottom-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                   </div>
                </div>
                {/* Floating Tickets */}
                <div className="absolute -top-2.5 -right-2.5 rotate-12 animate-float-slow">
                   <div className="bg-white p-1 rounded-lg shadow-xl">
                      <Ticket className="w-3.5 h-3.5 text-purple-600" />
                   </div>
                </div>
                <div className="absolute -bottom-1 -left-4 -rotate-12 animate-float-reverse">
                   <div className="bg-white p-1 rounded-lg shadow-xl text-emerald-500">
                      <Ticket className="w-3 h-3" />
                   </div>
                </div>
             </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 w-full pt-0.5">
             <Button 
               onClick={handleClaim}
               className="w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-950 font-black h-11 rounded-[18px] shadow-[0_10px_25px_rgba(250,204,21,0.3)] text-sm uppercase tracking-tighter active:scale-95 transition-all"
             >
               AMBIL VOUCHER
             </Button>
             <p className="text-[8px] text-white/40 mt-2.5 uppercase font-bold tracking-widest">
               *Syarat & Ketentuan Berlaku
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
