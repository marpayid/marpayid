"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Package, User, Phone, 
  Mail, Calendar, CreditCard, ChevronRight, 
  Truck, ExternalLink, Filter, Loader2, Save,
  MoreVertical, CheckCircle2, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, doc, updateDoc, query, orderBy } from 'firebase/firestore';
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

const ADMIN_EMAIL = 'dksplaybot@gmail.com';

export default function AdminOrdersPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setIsUpdatingId] = useState<string | null>(null);

  const ordersRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  const { data: orders, loading: ordersLoading } = useCollection(
    ordersRef ? query(ordersRef, orderBy('createdAt', 'desc')) : null
  );

  // Keamanan: Cek Admin
  if (!authLoading && user?.email !== ADMIN_EMAIL) {
    toast({ variant: "destructive", title: "Akses Ditolak", description: "Halaman ini hanya untuk admin." });
    router.replace('/');
    return null;
  }

  const handleUpdateOrder = async (orderId: string, updates: any) => {
    setIsUpdatingId(orderId);
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { ...updates, updatedAt: new Date() });
      
      toast({ variant: "success", title: "Berhasil", description: "Status pesanan diperbarui." });
    } catch (e) {
      console.error("Update error:", e);
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan sistem." });
    } finally {
      setIsUpdatingId(null);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Admin Pesanan</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
      </header>

      <main className="pt-20 px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Cari Nama/ID/HP..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 space-y-4">
                  {/* Header Pesanan */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{order.customerName}</h3>
                        <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">ID: {order.id?.slice(-6) || '...'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: id }) : 'Waktu tidak tersedia'}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                      order.status === 'Selesai' ? "bg-green-50 text-green-600" :
                      order.status === 'Dibatalkan' ? "bg-red-50 text-red-600" :
                      order.status === 'Dikirim' ? "bg-blue-50 text-blue-600" :
                      "bg-orange-50 text-orange-600"
                    )}>
                      {order.status}
                    </div>
                  </div>

                  {/* Info Kontak & Detail */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {order.customerPhone}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 truncate" />
                      {order.customerEmail}
                    </div>
                  </div>

                  {/* List Produk */}
                  <div className="bg-gray-50/50 rounded-2xl p-3 space-y-2 border border-dashed border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk yang Dibeli</p>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center gap-4">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1 flex-1">{item.name}</p>
                        <p className="text-xs font-bold text-gray-900 shrink-0">x{item.quantity}</p>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center mt-2">
                      <span className="text-[11px] font-bold text-gray-400">Total Pembayaran</span>
                      <span className="text-sm font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Update Status & Resi */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Update Status Pesanan</label>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => handleUpdateOrder(order.id, { status: val })}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className="rounded-xl h-11 border-gray-100 shadow-sm focus:ring-primary/20">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          <SelectItem value="Menunggu Pembayaran">Menunggu Pembayaran</SelectItem>
                          <SelectItem value="Pembayaran Diterima">Pembayaran Diterima</SelectItem>
                          <SelectItem value="Diproses">Diproses</SelectItem>
                          <SelectItem value="Dikirim">Dikirim</SelectItem>
                          <SelectItem value="Selesai">Selesai</SelectItem>
                          <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Kurir</label>
                        <Input 
                          placeholder="J&T / JNE"
                          defaultValue={order.courier || ''}
                          className="rounded-xl h-11 border-gray-100 text-xs"
                          onBlur={(e) => handleUpdateOrder(order.id, { courier: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nomor Resi</label>
                        <Input 
                          placeholder="No. Resi"
                          defaultValue={order.trackingNumber || ''}
                          className="rounded-xl h-11 border-gray-100 text-xs font-bold"
                          onBlur={(e) => handleUpdateOrder(order.id, { trackingNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    {order.status === 'Dikirim' && order.trackingNumber && (
                      <Button 
                        onClick={() => window.open(`https://cekresi.com/?noresi=${order.trackingNumber}`, '_blank')}
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-bold h-11 rounded-xl flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Lacak Pengiriman
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Package className="w-12 h-12 mb-2" />
              <p className="text-sm font-bold">Tidak ada pesanan ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
