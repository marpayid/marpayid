
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Package, User, 
  Calendar, CreditCard, Loader2, 
  MapPin, DollarSign, Database, ShieldAlert, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';
import { collection, doc, updateDoc, query, serverTimestamp } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ADMIN_EMAIL = 'cs.marpay@gmail.com';

const ORDER_STATUSES = [
  "Menunggu Konfirmasi",
  "Dikonfirmasi",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan"
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1. INVESTIGASI PATH
  const ordersRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  // 2. QUERY GLOBAL ADMIN (Tanpa filter userId)
  const { data: rawOrders, loading: ordersLoading, error: firestoreError } = useCollection(
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

  // Proteksi Halaman Admin
  if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Akses Dibatasi</h1>
        <p className="text-sm text-gray-500 mt-2">Hanya Admin MarPay (cs.marpay@gmail.com) yang diizinkan.</p>
        <Button onClick={() => router.replace('/')} className="mt-8 bg-primary text-white rounded-2xl px-8">Kembali ke Beranda</Button>
      </div>
    );
  }

  const handleUpdateOrder = async (orderId: string, updates: any) => {
    if (!db) return;
    setUpdatingId(orderId);
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { 
        ...updates, 
        updatedAt: serverTimestamp() 
      });
      toast({ variant: "success", title: "Berhasil Update", description: "Status pesanan telah diperbarui." });
    } catch (e) {
      toast({ variant: "destructive", title: "Gagal Update", description: "Periksa izin Firestore Admin Anda." });
    } finally {
      setUpdatingId(null);
    }
  };

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
      pending: orders.filter((o: any) => !['Selesai', 'selesai', 'Dibatalkan', 'dibatalkan'].includes(o.status)).length,
      completed: orders.filter((o: any) => ['Selesai', 'selesai'].includes(o.status)).length
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
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </Button>
          <h1 className="text-lg font-black">Dashboard Pesanan</h1>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-[10px] font-black text-primary uppercase">ADMIN MODE</span>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-4">
        {/* ENHANCED DIAGNOSTIC CONSOLE */}
        <div className="bg-slate-900 rounded-2xl p-4 text-[10px] font-mono text-cyan-400 space-y-2 border border-white/10 shadow-xl">
           <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-white">
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-widest">Admin Data Audit</span>
           </div>
           <p className="flex justify-between">
             <span className="text-gray-500">Project ID:</span> 
             <span className="text-white font-bold">{firebaseConfig.projectId}</span>
           </p>
           <p className="flex justify-between">
             <span className="text-gray-500">Collection Path:</span> 
             <span className="text-yellow-400">/orders</span>
           </p>
           <p className="flex justify-between">
             <span className="text-gray-500">Query Filter:</span> 
             <span className="text-green-400">NONE (List All)</span>
           </p>
           <p className="flex justify-between border-t border-white/5 pt-1 mt-1">
             <span className="text-gray-500">Admin Email:</span> 
             <span className="text-white">{user?.email}</span>
           </p>
           <p className="flex justify-between">
             <span className="text-gray-500">Admin UID:</span> 
             <span className="text-white truncate max-w-[150px]">{user?.uid}</span>
           </p>
           <p className="flex justify-between bg-white/5 p-1 rounded mt-1">
             <span className="text-gray-400 font-bold">TOTAL DOCS:</span> 
             <span className={cn("font-black text-base", orders.length > 0 ? "text-green-400" : "text-red-400")}>{orders.length}</span>
           </p>
           
           {firestoreError && (
             <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                <p className="font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> PERMISSION ERROR:</p>
                <p className="mt-1 leading-relaxed">{firestoreError.message}</p>
                <p className="mt-2 text-[9px] text-gray-400 italic">Catatan: Pastikan Security Rules mengizinkan 'list' untuk Admin ini.</p>
             </div>
           )}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Cari Nama, ID, atau HP..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Total</p>
              <p className="text-base font-black text-gray-900">{stats.total}</p>
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
              <div key={order.id} className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">ID: {order.id?.slice(-8).toUpperCase()}</span>
                        <span className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase",
                          ['Selesai', 'selesai'].includes(order.status) ? "bg-green-50 text-green-600 border-green-100" :
                          ['Dibatalkan', 'dibatalkan'].includes(order.status) ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                        )}>
                          {order.status || 'Menunggu Konfirmasi'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: id }) : 'Date N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-2xl space-y-2 border border-gray-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
                         <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="max-w-[120px]">
                         <p className="text-xs font-black text-gray-900 truncate">{order.customerName}</p>
                         <p className="text-[10px] text-gray-400 font-bold">{order.customerPhone}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.open(`https://wa.me/${order.customerPhone?.replace(/[^0-9]/g, '')}`, '_blank')}
                      className="h-8 px-4 rounded-lg bg-green-500 text-white text-[10px] font-black hover:bg-green-600"
                    >
                      CHAT WA
                    </Button>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-4 mt-4">
                  <div className="space-y-3">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start gap-4 pb-2 border-b border-gray-50 last:border-none">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.variant || 'Default'} • x{item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-gray-900">Rp {item.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-2xl">
                     <div className="flex items-center gap-2 opacity-70">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Total Bayar</span>
                     </div>
                     <p className="text-base font-black">Rp {order.totalAmount?.toLocaleString()}</p>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-2">
                     <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Alamat Pengiriman</p>
                     </div>
                     <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                        {order.shippingAddress?.fullAddress || 'Digital Service / No Address'}
                     </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-gray-50">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Atur Status Pesanan</label>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => handleUpdateOrder(order.id, { status: val })}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 font-bold">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {ORDER_STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(order.status === 'Dikirim' || order.trackingNumber) && (
                      <div className="grid grid-cols-2 gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-primary/60 uppercase">Ekspedisi</label>
                          <Input 
                            placeholder="J&T / Sicepat"
                            defaultValue={order.courier || ''}
                            className="rounded-xl h-10 border-white bg-white text-xs font-bold shadow-sm"
                            onBlur={(e) => handleUpdateOrder(order.id, { courier: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-primary/60 uppercase">Nomor Resi</label>
                          <Input 
                            placeholder="RESI12345"
                            defaultValue={order.trackingNumber || ''}
                            className="rounded-xl h-10 border-white bg-white text-xs font-bold text-primary shadow-sm"
                            onBlur={(e) => handleUpdateOrder(order.id, { trackingNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Package className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-base font-black">Tidak ada pesanan di Firestore</p>
              <p className="text-[10px] mt-2 max-w-[200px]">Jika Riwayat Pelanggan terisi tapi di sini kosong, kemungkinan besar query diblokir oleh Security Rules (Permission Denied).</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
