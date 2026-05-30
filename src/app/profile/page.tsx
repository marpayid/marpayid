
"use client"

import { BottomNav } from '@/components/bottom-nav';
import { 
  Settings, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ClipboardList,
  Bell,
  ShoppingBag,
  Wallet,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Profile() {
  const menuItems = [
    { 
      label: 'Daftar Transaksi', 
      description: 'Lihat semua pesanan dan status transaksi Anda.',
      icon: ClipboardList, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '/akun/transaksi'
    },
    { 
      label: 'Wishlist Saya', 
      description: 'Produk favorit yang telah disimpan.',
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      count: '0',
      path: '/akun/wishlist'
    },
    { 
      label: 'Alamat Pengiriman', 
      description: 'Kelola alamat pengiriman Anda.',
      icon: MapPin, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      path: '/akun/alamat'
    },
    { 
      label: 'Notifikasi', 
      description: 'Informasi pesanan dan promo terbaru.',
      icon: Bell, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      path: '/akun/notifikasi'
    },
    { 
      label: 'Pusat Bantuan', 
      description: 'Bantuan dan pertanyaan seputar MarPay.',
      icon: HelpCircle, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '/akun/bantuan'
    },
    { 
      label: 'Keamanan Akun', 
      description: 'Kelola keamanan akun dan data pribadi.',
      icon: ShieldCheck, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      path: '/akun/keamanan'
    },
    { 
      label: 'Pengaturan App', 
      description: 'Tema, preferensi, dan pengaturan aplikasi.',
      icon: Settings, 
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      path: '/akun/pengaturan'
    },
  ];

  const transactionStatuses = [
    { label: 'Menunggu', icon: Wallet, path: '/akun/transaksi?status=pending' },
    { label: 'Diproses', icon: Package, path: '/akun/transaksi?status=processing' },
    { label: 'Selesai', icon: CheckCircle, path: '/akun/transaksi?status=completed' },
    { label: 'Dibatalkan', icon: XCircle, path: '/akun/transaksi?status=cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white px-6 pt-14 pb-8 border-b border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarImage src="https://picsum.photos/seed/user-marpay/200/200" />
              <AvatarFallback className="bg-primary text-white font-bold text-xl">BS</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary border-2 border-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900 leading-tight">Budi Santoso</h2>
            <p className="text-xs font-bold text-primary mt-0.5 uppercase tracking-wider">Member Gold</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">budi.santoso@example.com</p>
          </div>
          <Link href="/akun/pengaturan">
            <Button variant="ghost" size="icon" className="text-gray-400 bg-gray-50 rounded-full h-10 w-10">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <Link href="/akun/transaksi" className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Pesanan</p>
              <p className="text-base font-black text-gray-800">0</p>
            </div>
          </Link>
          <Link href="/akun/wishlist" className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Produk Favorit</p>
              <p className="text-base font-black text-gray-800">0</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Status Pesanan</h3>
            <Link href="/akun/transaksi" className="text-[10px] font-bold text-primary">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {transactionStatuses.map((status) => (
              <Link key={status.label} href={status.path} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-active:scale-95 transition-all border border-gray-50">
                  <status.icon className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{status.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <Link 
              key={item.label} 
              href={item.path}
              className={cn(
                "flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer transition-colors",
                idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", item.bgColor, item.color)}>
                  <item.icon className="w-5 h-5 stroke-[2px]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{item.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && item.count !== '0' && (
                  <span className="bg-red-500 text-white text-[8px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </section>

        <Button 
          variant="ghost" 
          className="w-full text-red-500 font-black gap-3 h-14 rounded-2xl border-2 border-transparent hover:bg-red-50 transition-all uppercase text-xs tracking-widest mt-4"
        >
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </Button>

        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] pb-10">
          MarPay Marketplace v1.0.4
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
