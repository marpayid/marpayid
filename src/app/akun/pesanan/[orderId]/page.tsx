"use client"

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, XCircle, Loader2, Copy, MapPin, DollarSign, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetailPage() {
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

  const isAdmin = user?.email === 'cs.marpay@gmail.com';
  const isOwner = order?.userId === user?.uid || isAdmin;

  if (authLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order || !isOwner) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold">Pesanan Tidak Ditemukan</h1>
        <p className="text-sm text-gray-500 mt-2">Maaf, pesanan ini tidak dapat diakses atau tidak ada.</p>
        <Button onClick={() => router.replace('/akun/transaksi')} className="mt-8">Kembali</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Berhasil", description: "Nomor resi telah disalin." });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-50 text-green-600 border-green-100';
      case 'Dibatalkan': return 'bg-red-50 text-red-600 border-red-100';
      case 'Dikirim': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Detail Pesanan</h1>
      </header>

      <main className="pt-20 px-4 space-y-4">
        {/* Order Header */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor Pesanan</p>
              <h2 className="text-sm font-black text-primary">#{orderId.slice(-8).toUpperCase()}</h2>
            </div>
            <span className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border", getStatusColor(order.status))}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'dd MMMM yyyy, HH:mm', { locale: id }) : '-'}</span>
          </div>
        </section>

        {/* Shipping Status - Updated to Blue/White/Gray Theme */}
        {(order.status === 'Dikirim' || (order.status === 'Selesai' && order.trackingNumber)) && (
          <section className="bg-gradient-to-br from-[#1565FF] to-[#0057E7] text-white p-4 py-3.5 rounded-[24px] shadow-xl shadow-blue-100 space-y-3 relative overflow-hidden">
            <div className="absolute right-[-5px] top-[-5px] opacity-[0.1] pointer-events-none">
              <Truck className="w-16 h-16 rotate-12" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
               <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Truck className="w-4 h-4 text-white" />
               </div>
               <div>
                  <h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Status Pengiriman</h3>
                  <p className="text-sm font-black leading-tight">{order.shippingStatus || 'Dalam Pengiriman'}</p>
               </div>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-white/20 space-y-2 relative z-10 shadow-lg">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">Jasa Ekspedisi</span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-[#0F172A]">{order.courier || 'Kurir Pilihan'}</span>
                  </div>
                  {order.trackingNumber && (
                    <button 
                      onClick={() => copyToClipboard(order.trackingNumber)} 
                      className="text-[8px] font-black bg-[#1565FF] text-white px-2.5 py-1.5 rounded-lg shadow-sm active:scale-90 transition-transform uppercase tracking-tighter"
                    >
                      Salin Resi
                    </button>
                  )}
               </div>
               <div className="pt-0.5 border-t border-gray-100 mt-1">
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Nomor Resi</p>
                 <p className="text-xs font-black tracking-[0.1em] text-[#0F172A]">{order.trackingNumber || 'Menunggu Update Resi'}</p>
               </div>
            </div>
          </section>
        )}

        {/* Product Items */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Rincian Produk</h3>
          <div className="space-y-4">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                  <Package className="w-7 h-7 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Varian: {item.variant || 'Default'} • x{item.quantity}</p>
                  <p className="text-[11px] font-bold text-gray-900 mt-1">Rp {item.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer & Shipping Info */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
             <MapPin className="w-4 h-4 text-primary" />
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Alamat Pengiriman</h3>
          </div>
          <div className="text-[11px] space-y-1">
             <p className="font-black text-gray-900">{order.customerName}</p>
             <p className="font-bold text-gray-400">{order.customerPhone}</p>
             <p className="text-gray-600 leading-relaxed mt-1">
               {order.shippingAddress?.fullAddress}, {order.shippingAddress?.district}, {order.shippingAddress?.city}, {order.shippingAddress?.province}
             </p>
             {order.shippingAddress?.notes && (
               <p className="italic text-primary">Catatan: {order.shippingAddress.notes}</p>
             )}
          </div>
        </section>

        {/* Payment Summary */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
             <DollarSign className="w-4 h-4 text-primary" />
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Ringkasan Pembayaran</h3>
          </div>
          <div className="space-y-2.5">
             <div className="flex justify-between text-xs">
                <span className="text-gray-400">Metode Pembayaran</span>
                <span className="font-bold text-gray-800">{order.paymentMethod || 'WhatsApp Confirmation'}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Harga Barang</span>
                <span className="font-bold text-gray-800">Rp {order.items?.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-gray-400">Ongkos Kirim</span>
                <span className="font-bold text-gray-800">Rp {(order.totalAmount - order.items?.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0)).toLocaleString()}</span>
             </div>
             <div className="border-t border-gray-50 pt-2.5 flex justify-between">
                <span className="text-xs font-black uppercase text-gray-900">Total Bayar</span>
                <span className="text-base font-black text-primary">Rp {order.totalAmount?.toLocaleString()}</span>
             </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black flex items-center gap-2"
            onClick={() => window.open(`https://wa.me/6283851278935?text=${encodeURIComponent(`Halo Admin MarPay, saya ingin bertanya status pesanan saya dengan ID: ${orderId.slice(-8).toUpperCase()}`)}`, '_blank')}
          >
            <MessageCircle className="w-5 h-5" />
            Tanya Admin di WhatsApp
          </Button>
          <p className="text-[10px] text-gray-400 text-center px-6 leading-relaxed">
            Jika terjadi kendala pada pesanan Anda, silakan hubungi tim support MarPay melalui WhatsApp dengan menyertakan Nomor Pesanan.
          </p>
        </div>
      </main>
    </div>
  );
}
