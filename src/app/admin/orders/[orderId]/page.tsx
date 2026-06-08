
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Package, User, Calendar, CreditCard, Loader2, 
  MapPin, DollarSign, Database, ShieldAlert, RefreshCcw, Truck, 
  MessageCircle, Save, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn, getProductImage } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

const ADMIN_EMAIL = 'cs.marpay@gmail.com';

const ORDER_STATUSES = [
  "Menunggu Konfirmasi",
  "Dikonfirmasi",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
  "Dibatalkan Otomatis",
  "Gagal Bayar",
  "Tidak Dibayar"
];

const SHIPPING_STATUSES = [
  "Resi Dibuat",
  "Paket Diserahkan ke Kurir",
  "Dalam Perjalanan",
  "Sampai di Kota Tujuan",
  "Sedang Diantar",
  "Terkirim"
];

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const orderRef = useMemo(() => {
    if (!db || !orderId) return null;
    return doc(db, 'orders', orderId);
  }, [db, orderId]);

  const { data: order, loading: orderLoading } = useDoc<any>(orderRef);

  const [isUpdating, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    courier: '',
    trackingNumber: '',
    shippingStatus: ''
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'Menunggu Konfirmasi',
        courier: order.courier || '',
        trackingNumber: order.trackingNumber || '',
        shippingStatus: order.shippingStatus || ''
      });
    }
  }, [order]);

  if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold">Akses Dibatasi</h1>
        <p className="text-sm text-gray-500">Anda tidak memiliki izin administrator.</p>
        <Button onClick={() => router.replace('/')} className="mt-8">Kembali</Button>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!orderRef || !order) return;
    setIsSubmitting(true);

    let targetStatus = formData.status;
    if (formData.shippingStatus === 'Terkirim') {
      targetStatus = 'Selesai';
    }

    const updates: any = {
      ...formData,
      status: targetStatus,
      updatedAt: serverTimestamp()
    };

    if (targetStatus === 'Dikirim' && !order.shippedAt) updates.shippedAt = serverTimestamp();
    if (targetStatus === 'Selesai' && !order.completedAt) updates.completedAt = serverTimestamp();
    if (['Dibatalkan', 'Dibatalkan Otomatis', 'Gagal Bayar'].includes(targetStatus) && !order.cancelledAt) updates.cancelledAt = serverTimestamp();

    updateDoc(orderRef, updates)
      .then(() => {
        toast({ variant: "success", title: "Berhasil Update", description: "Perubahan telah disimpan ke Firestore." });
      })
      .catch(async (err) => {
        const permError = new FirestorePermissionError({
          path: orderRef.path,
          operation: 'update',
          requestResourceData: updates
        });
        errorEmitter.emit('permission-error', permError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (authLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return <div className="p-8 text-center font-bold">Pesanan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Kelola Pesanan</h1>
      </header>

      <main className="pt-20 px-4 space-y-5">
        <section className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
           <Database className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/5 -rotate-12" />
           <div className="relative z-10 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Order Management</p>
              <h2 className="text-2xl font-black">#{orderId.slice(-8).toUpperCase()}</h2>
              <div className="flex items-center gap-2 pt-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status: {order.status}</p>
              </div>
           </div>
        </section>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-6">
           <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Utama: Status Pesanan</label>
                 <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({...formData, status: val})}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold">
                       <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                       {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                 </Select>
              </div>

              {(formData.status === 'Dikirim' || order.trackingNumber || formData.status === 'Selesai') && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jasa Kurir</label>
                         <Input 
                            placeholder="Sicepat / J&T" 
                            value={formData.courier} 
                            onChange={(e) => setFormData({...formData, courier: e.target.value})} 
                            className="h-12 rounded-xl border-gray-100 bg-gray-50/50"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nomor Resi</label>
                         <Input 
                            placeholder="RESI12345" 
                            value={formData.trackingNumber} 
                            onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})} 
                            className="h-12 rounded-xl border-gray-100 bg-gray-50/50 text-primary font-bold"
                         />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Progress Pengiriman</label>
                      <Select 
                        value={formData.shippingStatus} 
                        onValueChange={(val) => {
                          setFormData(prev => ({
                            ...prev, 
                            shippingStatus: val,
                            status: val === 'Terkirim' ? 'Selesai' : prev.status
                          }));
                        }}
                      >
                         <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50">
                            <SelectValue placeholder="Pilih Status Pengiriman" />
                         </SelectTrigger>
                         <SelectContent className="rounded-2xl">
                            {SHIPPING_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                         </SelectContent>
                      </Select>
                   </div>
                </div>
              )}
           </div>

           <Button 
             onClick={handleUpdate} 
             disabled={isUpdating}
             className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 flex items-center gap-2"
           >
             {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
             SIMPAN PERUBAHAN
           </Button>
        </section>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
           <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Data Pelanggan</h3>
           <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><User className="w-5 h-5" /></div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Nama & Email</p>
                    <p className="text-xs font-black text-gray-900">{order.customerName}</p>
                    <p className="text-[10px] text-gray-500">{order.customerEmail || 'No Email'}</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Alamat Pengiriman</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
                       {order.shippingAddress?.fullAddress || 'Digital Product'}
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
           <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Daftar Belanja</h3>
           <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center gap-4 pb-3 border-b border-gray-50 last:border-none last:pb-0">
                   <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                         <Image 
                           src={getProductImage(item)} 
                           alt={item.name} 
                           fill 
                           className="object-cover"
                         />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-black text-gray-800 line-clamp-1">{item.name}</p>
                         <p className="text-[10px] text-gray-400 mt-0.5">Varian: {item.variant || 'Default'} • x{item.quantity}</p>
                      </div>
                   </div>
                   <p className="text-xs font-black text-gray-900 shrink-0">Rp {item.price?.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                 <p className="text-xs font-black uppercase text-gray-900">Total Transaksi</p>
                 <p className="text-lg font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
