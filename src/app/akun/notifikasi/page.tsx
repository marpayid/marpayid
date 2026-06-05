"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Tag, ShoppingBag, Truck, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const INTERNAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'promo',
    title: '🎁 Voucher Pengguna Baru Tersedia!',
    desc: 'Klaim voucher diskon Rp10.000 khusus untukmu. Gunakan sekarang sebelum masa berlaku habis.',
    time: 'Baru saja',
    icon: Tag,
    color: 'bg-orange-50 text-orange-500'
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: '🔥 Promo Flash Sale Hari Ini',
    desc: 'Diskon hingga 50% untuk produk skincare dan fashion viral. Cek katalog Flash Sale sekarang!',
    time: '2 jam yang lalu',
    icon: Zap,
    color: 'bg-red-50 text-red-500'
  },
  {
    id: 'notif-3',
    type: 'order',
    title: '🚚 Gratis Ongkir Produk Pilihan',
    desc: 'Belanja produk fashion pilihan dan dapatkan subsidi ongkir hingga Rp15.000 ke seluruh Indonesia.',
    time: '5 jam yang lalu',
    icon: Truck,
    color: 'bg-primary/10 text-primary'
  },
  {
    id: 'notif-4',
    type: 'order',
    title: '📱 Top Up & PPOB Tersedia',
    desc: 'Isi pulsa, token PLN, dan e-wallet makin mudah di MarPay. Proses instan 24 jam nonstop.',
    time: '1 hari yang lalu',
    icon: ShoppingBag,
    color: 'bg-blue-50 text-blue-500'
  }
];

export default function NotificationPage() {
  const router = useRouter();
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    // Load read status
    const saved = JSON.parse(localStorage.getItem('marpay_read_notifs') || '[]');
    setReadIds(saved);

    // Mark all as read when entering the page
    const allIds = INTERNAL_NOTIFICATIONS.map(n => n.id);
    localStorage.setItem('marpay_read_notifs', JSON.stringify(allIds));
    setReadIds(allIds);
    
    // Dispatch event to update header badge
    window.dispatchEvent(new Event('notif-updated'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Notifikasi</h1>
      </header>

      <main className="pt-20 px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-gray-100 p-1 rounded-2xl w-full mb-6">
            <TabsTrigger value="all" className="flex-1 rounded-xl text-[10px] font-bold uppercase py-2.5">Semua</TabsTrigger>
            <TabsTrigger value="order" className="flex-1 rounded-xl text-[10px] font-bold uppercase py-2.5">Transaksi</TabsTrigger>
            <TabsTrigger value="promo" className="flex-1 rounded-xl text-[10px] font-bold uppercase py-2.5">Promo</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-3">
            {INTERNAL_NOTIFICATIONS.map((notif) => {
              const isRead = readIds.includes(notif.id);
              return (
                <div 
                  key={notif.id} 
                  className={cn(
                    "bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 transition-all relative overflow-hidden",
                    !isRead && "ring-1 ring-primary/10"
                  )}
                >
                  {!isRead && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                  
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.color}`}>
                    <notif.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-gray-900 leading-tight pr-4">{notif.title}</h4>
                      <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{notif.desc}</p>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="order" className="mt-0 space-y-3">
            {INTERNAL_NOTIFICATIONS.filter(n => n.type === 'order').map((notif) => (
              <div key={notif.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.color}`}>
                  <notif.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{notif.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{notif.desc}</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="promo" className="mt-0 space-y-3">
             {INTERNAL_NOTIFICATIONS.filter(n => n.type === 'promo').map((notif) => (
              <div key={notif.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.color}`}>
                  <notif.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{notif.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{notif.desc}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Semua sudah dibaca
          </div>
        </div>
      </main>
    </div>
  );
}
