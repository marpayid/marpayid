
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Package, User, Phone, 
  Calendar, CreditCard, Truck, Loader2, 
  MoreVertical, CheckCircle2, Clock, XCircle, 
  MapPin, ShoppingCart, DollarSign, Send, ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
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

  const ordersRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  const { data: orders, loading: ordersLoading } = useCollection(
    ordersRef ? query(ordersRef, orderBy('createdAt', 'desc')) : null
  );

  if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Akses Ditolak</h1>
        <p className="text-sm text-gray-500 mt-2">Hanya Admin MarPay yang dapat mengakses halaman ini.</p>
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
      toast({ variant: "success", title: "Berhasil Update", description: "Data pesanan telah diperbarui." });
    } catch (e) {
      toast({ variant: "destructive", title: "Gagal Update", description: "Terjadi kesalahan sistem." });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => 
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone?.includes(searchQuery)
    );
  }, [orders, searchQuery]);

  if (authLoading || ordersLoading) {
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
              <p className="text-base font-black text-gray-900">{orders?.length || 0}</p>
           </div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Pending</p>
              <p className="text-base font-black text-orange-500">{orders?.filter(o => o.status === 'Menunggu Konfirmasi' || o.status === 'perlu_diproses').length || 0}</p>
           </div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Selesai</p>
              <p className="text-base font-black text-emerald-500">{orders?.filter(o => o.status === 'Selesai' || o.status === 'selesai').length || 0}</p>
           </div>
        </div>

        <div className="space-y-4 mt-2">
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
                          order.status === 'Selesai' || order.status === 'selesai' ? "bg-green-50 text-green-600 border border-green-100" :
                          order.status === 'Dibatalkan' || order.status === 'dibatalkan' ? "bg-red-50 text-red-600 border border-red-100" :
                          "bg-orange-50 text-orange-600 border border-orange-100"
                        )}>
                          {order.status || 'Menunggu Konfirmasi'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: id }) : 'Waktu tidak valid'}</span>
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
                    <div className="flex items-center gap-2 mb-1">
                       <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Keranjang</p>
                    </div>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start gap-4 pb-2 border-b border-gray-50 last:border-none">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.variant || 'No Variant'} • x{item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-gray-900">Rp {item.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-2xl shadow-inner">
                     <div className="flex items-center gap-2 opacity-70">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Total Bayar</span>
                     </div>
                     <p className="text-base font-black">Rp {order.totalAmount?.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-1">
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Metode</p>
                        <div className="flex items-center gap-1.5">
                           <CreditCard className="w-3 h-3 text-blue-500" />
                           <span className="text-[11px] font-bold text-gray-700">{order.paymentMethod || 'Manual'}</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Status Bayar</p>
                        <Select 
                          defaultValue={order.paymentStatus || "Menunggu Pembayaran"}
                          onValueChange={(val) => handleUpdateOrder(order.id, { paymentStatus: val })}
                          disabled={updatingId === order.id}
                        >
                          <SelectTrigger className="h-7 text-[10px] font-black border-none bg-transparent p-0 focus:ring-0 text-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Menunggu Pembayaran">Menunggu Pembayaran</SelectItem>
                            <SelectItem value="Lunas">Lunas</SelectItem>
                            <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
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
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Atur Progress Pesanan</label>
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

                    {(order.status === 'Dikirim' || order.status === 'dikirim' || order.trackingNumber) && (
                      <div className="grid grid-cols-2 gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in zoom-in-95">
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
              <p className="text-base font-black">Tidak ada pesanan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
