"use client"

import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Package, Clock, CheckCircle2, Truck, XCircle, Loader2, ChevronRight, AlertCircle, Timer, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { cn, getProductImage } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';

// Countdown Component for expired orders
function OrderCountdown({ expiredAt, orderId, status }: { expiredAt: any, orderId: string, status: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const db = useFirestore();
  const isExpiringRef = useRef(false);

  useEffect(() => {
    if (!expiredAt || status !== 'Menunggu Konfirmasi') return;

    const timer = setInterval(async () => {
      const now = new Date().getTime();
      const expiryTime = expiredAt?.toMillis ? expiredAt.toMillis() : new Date(expiredAt).getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft('Expired');
        
        // Prevent multiple simultaneous updates
        if (!isExpiringRef.current) {
          isExpiringRef.current = true;
          const orderRef = doc(db, 'orders', orderId);
          try {
            await updateDoc(orderRef, {
              status: 'Dibatalkan Otomatis',
              cancelReason: 'Batas waktu pembayaran habis',
              cancelledAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } catch (e) {
            console.error("Auto-cancel update failed:", e);
            isExpiringRef.current = false;
          }
        }
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt, orderId, status, db]);

  if (status !== 'Menunggu Konfirmasi') return null;

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
      <div className="w-3 h-3 flex items-center justify-center">
        <Timer className="w-full h-full" />
      </div>
      <span>Bayar dalam: {timeLeft || '00:00:00'}</span>
    </div>
  );
}

export default function TransactionPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState('all');

  const ordersRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  // STABILIZE QUERY TO PREVENT RE-SUBSCRIPTION LOOPS
  const ordersQuery = useMemo(() => {
    if (!ordersRef || !user?.uid) return null;
    return query(
      ordersRef, 
      where('userId', '==', user.uid)
    );
  }, [ordersRef, user?.uid]);

  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    // Sort by Date Desc
    const sorted = [...orders].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    return sorted.filter((order: any) => {
      const status = order.status || 'Menunggu Konfirmasi';
      
      if (activeTab === 'all') return true;
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
        return ['Dibatalkan', 'Dibatalkan Otomatis', 'Gagal Bayar', 'Tidak Dibayar'].includes(status);
      }
      return false;
    });
  }, [orders, activeTab]);

  const statuses = [
    { label: 'Semua', value: 'all' },
    { label: 'Proses', value: 'proses' },
    { label: 'Dikirim', value: 'Dikirim' },
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Dibatalkan', value: 'Dibatalkan' },
  ];

  if (authLoading || (ordersLoading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('menunggu') || s.includes('dikonfirmasi')) return <Clock className="w-4 h-4 text-orange-500" />;
    if (s.includes('proses') || s.includes('kemas')) return <Package className="w-4 h-4 text-primary" />;
    if (s.includes('kirim')) return <Truck className="w-4 h-4 text-blue-500" />;
    if (s.includes('selesai')) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (s.includes('batal') || s.includes('gagal')) return <XCircle className="w-4 h-4 text-red-500" />;
    return <ClipboardList className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Riwayat Pesanan</h1>
        {ordersLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-300 ml-auto" />}
      </header>

      <main className="pt-20 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start h-auto p-0 mb-6 gap-2">
            {statuses.map(s => (
              <TabsTrigger 
                key={s.value} 
                value={s.value} 
                className="rounded-full px-5 py-2.5 text-[10px] font-bold uppercase border border-gray-100 bg-white data-[state=active]:bg-primary data-[state=active]:text-white transition-all shadow-sm shrink-0"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {statuses.map(s => (
            <TabsContent key={s.value} value={s.value} className="mt-0 space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <Link key={order.id} href={`/akun/pesanan/${order.id}`}>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4 mb-4 active:scale-[0.98] transition-all">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             {getStatusIcon(order.status)}
                             <span className="text-[11px] font-bold">
                               {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: id }) : 'Proses...'}
                             </span>
                           </div>
                           <span className={cn(
                             "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border",
                             ['Selesai'].includes(order.status) ? "bg-green-50 text-green-600 border-green-100" :
                             ['Dibatalkan', 'Dibatalkan Otomatis', 'Gagal Bayar', 'Tidak Dibayar'].includes(order.status) ? "bg-red-50 text-red-600 border-red-100" :
                             ['Dikirim'].includes(order.status) ? "bg-blue-50 text-blue-600 border-blue-100" :
                             "bg-orange-50 text-orange-600 border-orange-100"
                           )}>
                             {order.status || 'Menunggu Konfirmasi'}
                           </span>
                        </div>
                        <OrderCountdown expiredAt={order.expiredAt} orderId={order.id} status={order.status} />
                      </div>

                      <div className="space-y-3">
                        {order.items?.slice(0, 1).map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                              {item.type === 'digital' ? (
                                <Smartphone className="w-6 h-6 text-primary opacity-40" />
                              ) : (
                                <Image 
                                  src={getProductImage(item)} 
                                  alt={item.name} 
                                  fill 
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} barang x Rp {item.price?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 1 && (
                          <p className="text-[10px] text-gray-400 font-medium">+{order.items.length - 1} produk lainnya</p>
                        )}
                      </div>

                      <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Total Tagihan</p>
                          <p className="text-sm font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                          Detail Pesanan <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
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
