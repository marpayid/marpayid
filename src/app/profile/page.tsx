"use client"

import { BottomNav } from '@/components/bottom-nav';
import { Settings, Wallet, CreditCard, Gift, Heart, MapPin, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const menuItems = [
    { label: 'Wishlist Saya', icon: Heart, count: '12' },
    { label: 'Daftar Alamat', icon: MapPin },
    { label: 'Metode Pembayaran', icon: CreditCard },
    { label: 'Keamanan Akun', icon: Shield },
    { label: 'Bantuan & Hubungi Kami', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-primary pt-12 pb-24 px-6 relative overflow-hidden rounded-b-[40px]">
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
         <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
         
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-white font-headline text-xl font-bold">Profil MarPay</h1>
           <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
             <Settings className="w-5 h-5" />
           </Button>
         </div>

         <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/50 shadow-xl">
              <AvatarImage src="https://picsum.photos/seed/user1/200/200" />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h2 className="text-lg font-bold">Budi Santoso</h2>
              <p className="text-xs text-white/80">Member Gold • Silver Level</p>
            </div>
         </div>
      </header>

      <main className="px-4 -mt-12 relative z-10 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center divide-x divide-gray-100">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-primary">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-bold">Saldo MarPay</span>
            </div>
            <p className="text-sm font-bold">Rp 2.500.000</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-secondary">
              <Gift className="w-4 h-4" />
              <span className="text-[10px] font-bold">Poin Reward</span>
            </div>
            <p className="text-sm font-bold">1.250 Pts</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <div 
              key={item.label} 
              className={`flex items-center justify-between p-4 ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''} active:bg-gray-50 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count && <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{item.count}</span>}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full text-red-500 font-bold gap-2 py-6 rounded-2xl border-2 border-transparent hover:bg-red-50 hover:border-red-100 mt-4">
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}