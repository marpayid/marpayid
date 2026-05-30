"use client"

import { BottomNav } from '@/components/bottom-nav';
import { Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';

export default function Orders() {
  const statuses = [
    { label: 'Semua', value: 'all' },
    { label: 'Berlangsung', value: 'on-going' },
    { label: 'Selesai', value: 'completed' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-50">
        <h1 className="text-xl font-headline font-bold mb-4">Pesanan Saya</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Cari transaksi kamu..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </header>

      <main className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start h-auto p-0 mb-4 gap-2">
            {statuses.map(s => (
              <TabsTrigger 
                key={s.value} 
                value={s.value} 
                className="rounded-full px-5 py-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md border border-gray-100 bg-white"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-bold">Belanja • 24 Okt 2023</span>
                   </div>
                   <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-600">Selesai</span>
                </div>
                <div className="flex gap-3 mb-4">
                   <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={Products[0].image || ''} alt="" fill className="object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xs font-bold line-clamp-1">{Products[0].name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">1 barang x Rp {Products[0].price.toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                   <div>
                      <p className="text-[10px] text-muted-foreground">Total Belanja</p>
                      <p className="text-sm font-bold">Rp {Products[0].price.toLocaleString()}</p>
                   </div>
                   <Button variant="outline" size="sm" className="rounded-lg h-8 text-[11px] font-bold border-primary text-primary hover:bg-primary/5">
                      Beli Lagi
                   </Button>
                </div>
             </div>

             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-bold">Belanja • 25 Okt 2023</span>
                   </div>
                   <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600">Dikirim</span>
                </div>
                <div className="flex gap-3 mb-4">
                   <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={Products[1].image || ''} alt="" fill className="object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xs font-bold line-clamp-1">{Products[1].name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">1 barang x Rp {Products[1].price.toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                   <div>
                      <p className="text-[10px] text-muted-foreground">Total Belanja</p>
                      <p className="text-sm font-bold">Rp {Products[1].price.toLocaleString()}</p>
                   </div>
                   <Button size="sm" className="bg-primary text-white rounded-lg h-8 text-[11px] font-bold">
                      Lacak
                   </Button>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}