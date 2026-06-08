
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Package, User, 
  Calendar, CreditCard, Loader2, 
  MapPin, DollarSign, Database, ShieldAlert, RefreshCcw, ChevronRight,
  ShieldCheck, Activity, Server, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

const ADMIN_EMAIL = 'cs.marpay@gmail.com';

export default function AdminOrdersPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();

  const [searchQuery, setSearchQuery] = useState('');

  const ordersRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  const { data: rawOrders, loading: ordersLoading } = useCollection(
    ordersRef ? query(ordersRef) : null
  );

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return [...rawOrders].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [rawOrders]);

  // SYSTEM CLEANUP & AUTO-CANCEL LOGIC
  useEffect(() => {
    if (!orders || orders.length === 0 || !db) return;

    const runCleanup = async () => {
      const now = new Date().getTime();
      const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

      orders.forEach(async (order: any) => {
        // 1. Auto-Cancel Expired Orders (6 Hours)
        if (order.status === 'Menunggu Konfirmasi' && order.expiredAt) {
          const distance = order.expiredAt.toMillis() - now;
          if (distance <= 0) {
            updateDoc(doc(db, 'orders', order.id), {
              status: 'Dibatalkan Otomatis',
              cancelReason: 'Pesanan tidak dikonfirmasi dalam 6 jam',
              cancelledAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        }

        // 2. Permanent Delete Old Cancelled Orders (15 Days)
        const cancelledStatuses = ['Dibatalkan', 'Dibatalkan Otomatis', 'Gagal Bayar', 'Tidak Dibayar'];
        if (cancelledStatuses.includes(order.status) && order.cancelledAt) {
          const cancelTime = order.cancelledAt.toMillis();
          if (now - cancelTime > fifteenDaysMs) {
            deleteDoc(doc(db, 'orders', order.id));
          }
        }
      });
    };

    runCleanup();
  }, [orders, db]);

  if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Akses Dibatasi</h1>
        <p className="text-sm text-gray-500 mt-2">Halaman ini hanya untuk Administrator.</p>
        <Button onClick={() => router.replace('/')} className="mt-8">Kembali</Button>
      </div>
    );
  }

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o: any) => 
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone?.includes(searchQuery)
    );
  }, [orders, searchQuery]);

  const stats = useMemo(() => {
    if (!orders) return { total: 0, pending: 0, completed: 0 };
    return {
      total: orders.length,
      pending: orders.filter((o: any) => !['Selesai', 'Dibatalkan', 'Dibatalkan Otomatis', 'Gagal Bayar'].includes(o.status)).length,
      completed: orders.filter((o: any) => o.status === 'Selesai').length
    };
  }, [orders]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-black">Dashboard Pesanan</h1>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-[10px] font-black text-primary uppercase">ADMIN</span>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-4">
        <div className="bg-[#0B1120] rounded-[28px] p-5 border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>
           <div className="relative z-10 space-y-3.5">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                       <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                       <h2 className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em] leading-none">MarPay Control Center</h2>
                       <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">System Online</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                 <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Database Status</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black rounded-md uppercase tracking-tighter">Connected</span>
                 </div>
                 <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Order Collection</span>
                    <span className="text-xs font-black text-white">{orders.length} Records</span>
                 </div>
                 <div className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Admin Access</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black rounded-md uppercase tracking-tighter">Authorized</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Cari Nama atau ID..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Total</p>
              <p className="text-base font-black">{stats.total}</p>
           </div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Pending</p>
              <p className="text-base font-black text-orange-500">{stats.pending}</p>
           </div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Selesai</p>
              <p className="text-base font-black text-emerald-500">{stats.completed}</p>
           </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col p-5 space-y-4 active:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">ID: {order.id?.slice(-8).toUpperCase()}</span>
                        <span className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter",
                          order.status === 'Selesai' ? "bg-green-50 text-green-600 border-green-100" :
                          ['Dibatalkan', 'Dibatalkan Otomatis'].includes(order.status) ? "bg-red-50 text-red-600 border-red-100" :
                          order.status === 'Dikirim' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                        )}>
                          {order.status || 'Menunggu Konfirmasi'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy', { locale: id }) : 'Date N/A'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-2xl flex items-center justify-between border border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
                         <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="max-w-[150px]">
                         <p className="text-xs font-black text-gray-900 truncate">{order.customerName}</p>
                         <p className="text-[10px] text-gray-400 font-bold">{order.customerPhone}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Package className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-base font-black">Tidak ada pesanan</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-500 font-medium leading-relaxed">
            Sistem Pembersihan Aktif: Pesanan dengan status Batal akan dihapus otomatis secara permanen setelah 15 hari untuk menjaga performa database.
          </p>
        </div>
      </main>
    </div>
  );
}
