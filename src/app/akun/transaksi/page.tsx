
"use client"

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Search, Package, Clock, CheckCircle2, Truck, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TransactionPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();

  const ordersRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'orders');
  }, [db, user?.uid]);

  const { data: orders, loading: ordersLoading } = useCollection(
    ordersRef ? query(
      ordersRef, 
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc')
    ) : null
  );

  const statuses = [
    { label: 'Semua', value: 'all' },
    { label: 'Proses', value: 'perlu_diproses' },
    { label: 'Kirim', value: 'dikirim' },
    { label: 'Selesai', value: 'selesai' },
    { label: 'Batal', value: 'dibatalkan' },
  ];

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'perlu_diproses': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'dikemas': return <Package className="w-4 h-4 text-blue-500" />;
      case 'dikirim': return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'selesai': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'dibatalkan': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <ClipboardList className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'perlu_diproses': return 'Perlu Diproses';
      case 'dikemas': return 'Sedang Dikemas';
      case 'dikirim': return 'Sedang Dikirim';
      case 'selesai': return 'Selesai';
      case 'dibatalkan': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Riwayat Pesanan</h1>
      </header>

      <main className="pt-20 px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start h-auto p-0 mb-6 gap-2">
            {statuses.map(s => (
              <TabsTrigger 
                key={s.value} 
                value={s.value} 
                className="rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg border border-gray-100 bg-white transition-all shadow-sm"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-[11px] font-bold">
                        {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy', { locale: id }) : '...'}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border",
                      order.status === 'selesai' ? "bg-green-50 text-green-600 border-green-100" :
                      order.status === 'dibatalkan' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} barang x Rp {item.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Total Tagihan</p>
                      <p className="text-sm font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</p>
                    </div>
                    
                    {order.status === 'dikirim' && order.trackingNumber ? (
                      <Button 
                        onClick={() => router.push(`/cek-resi?resi=${order.trackingNumber}`)}
                        className="bg-primary text-white text-[10px] font-bold h-9 px-4 rounded-xl shadow-lg shadow-primary/20"
                      >
                        Lacak Pesanan
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="border-primary/20 text-primary text-[10px] font-bold h-9 px-4 rounded-xl"
                        onClick={() => window.open(`https://wa.me/6283851278935?text=${encodeURIComponent(`Halo Admin MarPay, saya ingin bertanya status pesanan saya: ID ${order.id?.slice(-8).toUpperCase()}`)}`, '_blank')}
                      >
                        Tanya Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Belum ada riwayat pesanan</h3>
                <p className="text-[10px] font-medium text-gray-500 mt-1 max-w-[200px]">Semua pesanan Anda akan muncul di sini secara otomatis.</p>
              </div>
            )}
          </TabsContent>
          
          {statuses.slice(1).map(statusTab => (
            <TabsContent key={statusTab.value} value={statusTab.value} className="mt-0">
               <div className="space-y-4 pt-4">
                  {orders?.filter(o => o.status === statusTab.value).map((order: any) => (
                    <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                      {/* Item content same as above... simplified for brevity in prototype */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{order.customerName}</span>
                        <span className="text-[10px] font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">ID: {order.id?.slice(-8).toUpperCase()}</p>
                    </div>
                  ))}
                  {orders?.filter(o => o.status === statusTab.value).length === 0 && (
                    <div className="py-20 text-center opacity-30">
                      <p className="text-xs font-bold">Tidak ada pesanan dengan status ini</p>
                    </div>
                  )}
               </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
