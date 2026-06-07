"use client"

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Package, Clock, CheckCircle2, Truck, XCircle, Loader2, Copy, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';
import { collection, query, where } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function TransactionPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const ordersRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'orders');
  }, [db, user?.uid]);

  const { data: orders, loading: ordersLoading, error: firestoreError } = useCollection(
    ordersRef ? query(
      ordersRef, 
      where('userId', '==', user?.uid)
    ) : null
  );

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return sortedOrders;
    
    return sortedOrders.filter((order: any) => {
      const status = order.status || 'Menunggu Konfirmasi';
      
      if (activeTab === 'proses') {
        return ['Menunggu Konfirmasi', 'Dikonfirmasi', 'Diproses'].includes(status);
      }
      if (activeTab === 'Dikirim') {
        return status === 'Dikirim';
      }
      if (activeTab === 'Selesai') {
        return status === 'Selesai';
      }
      if (activeTab === 'Dibatalkan') {
        return status === 'Dibatalkan';
      }
      return false;
    });
  }, [sortedOrders, activeTab]);

  const statuses = [
    { label: 'Semua', value: 'all' },
    { label: 'Proses', value: 'proses' },
    { label: 'Dikirim', value: 'Dikirim' },
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Batal', value: 'Dibatalkan' },
  ];

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('menunggu') || s.includes('dikonfirmasi')) return <Clock className="w-4 h-4 text-orange-500" />;
    if (s.includes('proses') || s.includes('kemas')) return <Package className="w-4 h-4 text-blue-500" />;
    if (s.includes('kirim')) return <Truck className="w-4 h-4 text-indigo-500" />;
    if (s.includes('selesai')) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (s.includes('batal')) return <XCircle className="w-4 h-4 text-red-500" />;
    return <ClipboardList className="w-4 h-4 text-gray-400" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Berhasil", description: "Nomor resi telah disalin." });
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
        {/* DIAGNOSTIC CONSOLE */}
        <div className="mb-4 bg-slate-900 rounded-2xl p-4 text-[10px] font-mono text-cyan-400 space-y-2 border border-white/10">
           <div className="flex items-center gap-2 mb-2 text-white border-b border-white/5 pb-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> 
              <span className="font-bold uppercase tracking-widest">Customer Data Audit</span>
           </div>
           <p className="flex justify-between">
             <span className="text-gray-500">Project:</span> 
             <span className="text-white font-bold">{firebaseConfig.projectId}</span>
           </p>
           <p className="flex justify-between">
             <span className="text-gray-500">Docs Found:</span> 
             <span className="text-white font-black text-sm">{sortedOrders.length}</span>
           </p>
           {firestoreError && (
             <p className="text-red-400 bg-red-500/10 p-2 rounded mt-2">Error: {firestoreError.message}</p>
           )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start h-auto p-0 mb-6 gap-2">
            {statuses.map(s => (
              <TabsTrigger 
                key={s.value} 
                value={s.value} 
                className="rounded-full px-5 py-2.5 text-[10px] font-bold uppercase border border-gray-100 bg-white data-[state=active]:bg-primary data-[state=active]:text-white transition-all shadow-sm"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {statuses.map(s => (
            <TabsContent key={s.value} value={s.value} className="mt-0 space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-[11px] font-bold">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy', { locale: id }) : 'Waktu diproses...'}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border",
                        ['Selesai'].includes(order.status) ? "bg-green-50 text-green-600 border-green-100" :
                        ['Dibatalkan'].includes(order.status) ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-orange-50 text-orange-600 border-orange-100"
                      )}>
                        {order.status || 'Menunggu Konfirmasi'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                             <Package className="w-6 h-6 text-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} barang x Rp {item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {(order.status === 'Dikirim' || order.trackingNumber) && (
                      <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 space-y-2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-primary">
                             <Truck className="w-3.5 h-3.5" />
                             <p className="text-[10px] font-black uppercase">{order.courier || 'Kurir Standar'}</p>
                           </div>
                           {order.trackingNumber && (
                             <button onClick={() => copyToClipboard(order.trackingNumber)} className="flex items-center gap-1 text-[9px] font-bold text-primary bg-white px-2 py-1 rounded-lg border border-primary/10">
                               <Copy className="w-2.5 h-2.5" /> Salin Resi
                             </button>
                           )}
                         </div>
                         <p className="text-[11px] font-bold text-gray-600">No. Resi: <span className="text-primary">{order.trackingNumber || 'Belum diupdate'}</span></p>
                      </div>
                    )}

                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Total Tagihan</p>
                        <p className="text-sm font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</p>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-primary/20 text-primary text-[10px] font-bold h-9 px-4 rounded-xl"
                        onClick={() => window.open(`https://wa.me/6283851278935?text=${encodeURIComponent(`Halo Admin MarPay, saya ingin bertanya status pesanan saya: ID ${order.id?.slice(-8).toUpperCase()}`)}`, '_blank')}
                      >
                        Tanya Admin
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                  <ClipboardList className="w-10 h-10 mb-4" />
                  <h3 className="text-sm font-bold text-gray-900">
                    {activeTab === 'all' ? 'Belum ada riwayat pesanan' : `Belum ada pesanan ${s.label}`}
                  </h3>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
