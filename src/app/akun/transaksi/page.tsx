
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TransactionPage() {
  const router = useRouter();

  const statuses = [
    { label: 'Semua', value: 'all' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Diproses', value: 'processing' },
    { label: 'Selesai', value: 'completed' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Daftar Transaksi</h1>
      </header>

      <main className="pt-20 px-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Cari transaksi..." 
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start h-auto p-0 mb-6 gap-2">
            {statuses.map(s => (
              <TabsTrigger 
                key={s.value} 
                value={s.value} 
                className="rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md border border-gray-100 bg-white transition-all"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <ClipboardList className="w-10 h-10" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Belum ada transaksi</h3>
              <p className="text-[10px] font-medium text-gray-500 mt-1 max-w-[200px]">Yuk, mulai belanja dan penuhi kebutuhanmu di MarPay!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
