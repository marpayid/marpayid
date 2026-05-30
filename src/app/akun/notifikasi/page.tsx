
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Tag, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationPage() {
  const router = useRouter();

  const mockNotifications = [
    {
      id: 1,
      type: 'promo',
      title: 'Promo Flash Sale Hari Ini!',
      desc: 'Dapatkan diskon hingga 50% untuk produk skincare pilihan. Cek sekarang!',
      time: '2 jam yang lalu',
      icon: Tag,
      color: 'bg-orange-50 text-orange-500'
    },
    {
      id: 2,
      type: 'order',
      title: 'Selamat Bergabung di MarPay',
      desc: 'Terima kasih telah menggunakan MarPay untuk kebutuhan digitalmu.',
      time: '1 hari yang lalu',
      icon: ShoppingBag,
      color: 'bg-primary/10 text-primary'
    }
  ];

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
            {mockNotifications.map((notif) => (
              <div key={notif.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 active:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.color}`}>
                  <notif.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                    <span className="text-[9px] text-gray-400 font-medium">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{notif.desc}</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="order" className="mt-0 text-center py-20 opacity-40">
            <h3 className="text-sm font-bold text-gray-900">Belum ada notifikasi transaksi</h3>
          </TabsContent>

          <TabsContent value="promo" className="mt-0 text-center py-20 opacity-40">
            <h3 className="text-sm font-bold text-gray-900">Belum ada notifikasi promo</h3>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
