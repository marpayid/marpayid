"use client"

import { useState, useEffect } from 'react';
import { X, Gift, Zap, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Logika tampil 1 kali per hari
    const lastShown = localStorage.getItem('marpay_promo_last_shown');
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    if (lastShown !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Muncul setelah 1.5 detik agar halus
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('marpay_promo_last_shown', today);
    setIsOpen(false);
  };

  const handleClaim = () => {
    // Simulasi klaim
    handleClose();
    window.location.href = '/akun/voucher';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-[340px] animate-in zoom-in-95 duration-500">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 text-white flex flex-col items-center text-center px-8 py-6">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          {/* Header Visual */}
          <div className="relative z-10 mb-4 flex flex-col items-center">
             <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-3 animate-bounce">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  PROMO SPESIAL
                </p>
             </div>
             
             {/* Logo MarPay Placeholder */}
             <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
                   <span className="font-black text-lg">M</span>
                </div>
                <span className="text-xl font-black tracking-tighter">MarPay</span>
             </div>
          </div>

          {/* Body Text */}
          <div className="relative z-10 space-y-2 mb-6">
             <h2 className="text-2xl font-black leading-none tracking-tight">
               VOUCHER<br/>PENGGUNA BARU
             </h2>
             <div className="w-12 h-1 bg-yellow-400 mx-auto rounded-full opacity-50 my-2"></div>
             <p className="text-sm font-medium text-white/80 leading-relaxed">
               Diskon <span className="text-yellow-400 font-black">Rp10.000</span> untuk<br/>minimal belanja Rp50.000
             </p>
          </div>

          {/* Illustration Section */}
          <div className="relative z-10 mb-6 w-full flex justify-center">
             <div className="relative animate-float">
                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[24px] border border-white/20 shadow-2xl relative overflow-hidden">
                   <Gift className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                   <div className="absolute -right-2 -bottom-2">
                      <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400 animate-pulse" />
                   </div>
                </div>
                {/* Floating Tickets */}
                <div className="absolute -top-4 -right-4 rotate-12 animate-float-slow">
                   <div className="bg-white p-1.5 rounded-lg shadow-xl">
                      <Ticket className="w-5 h-5 text-purple-600" />
                   </div>
                </div>
                <div className="absolute -bottom-2 -left-6 -rotate-12 animate-float-reverse">
                   <div className="bg-white p-1.5 rounded-lg shadow-xl text-emerald-500">
                      <Ticket className="w-4 h-4" />
                   </div>
                </div>
             </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 w-full pt-1">
             <Button 
               onClick={handleClaim}
               className="w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-950 font-black h-12 rounded-2xl shadow-[0_10px_25px_rgba(250,204,21,0.3)] text-base uppercase tracking-tighter active:scale-95 transition-all"
             >
               AMBIL VOUCHER
             </Button>
             <p className="text-[9px] text-white/40 mt-3 uppercase font-bold tracking-widest">
               *Syarat & Ketentuan Berlaku
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}