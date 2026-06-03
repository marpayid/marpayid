'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, CreditCard, Edit3, MessageCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

import Image from 'next/image';
import { cn, getProductImage } from '@/lib/utils';
import { useUser } from '@/firebase';

interface AddressData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  fullAddress: string;
  notes?: string;
}

export default function Checkout() {
  const router = useRouter();
  const { user } = useUser();
  
  const [items, setItems] = useState<any[]>([]);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [tempAddress, setTempAddress] = useState<AddressData>({
    name: '', phone: '', province: '', city: '', district: '', fullAddress: '', notes: ''
  });
  const [selectedPayment, setSelectedPayment] = useState<string>('bank_transfer');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const tempItem = localStorage.getItem('marpay_checkout_temp');
    if (tempItem) {
      try {
        setItems(JSON.parse(tempItem));
      } catch (e) {
        console.error("Failed to parse temp checkout item");
      }
    } else {
      const savedCart = localStorage.getItem('marpay_cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart");
        }
      }
    }

    const savedAddress = localStorage.getItem('marpay_address');
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        setAddress(parsed);
        setTempAddress(parsed);
      } catch (e) {
        console.error("Failed to parse address");
      }
    }
    setIsLoaded(true);
  }, []);

  const totalItemsPrice = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const totalShipping = items.reduce((acc, item) => {
    if (!item.shippingFee || item.shippingFee <= 0) return acc;
    const additionalFee = Math.max(0, item.quantity - 1) * 5000;
    return acc + (item.shippingFee + additionalFee);
  }, 0);

  const totalBill = totalItemsPrice + totalShipping;
  const isDigital = items.length > 0 && items.every(item => item.type === 'digital');

  const saveAddress = () => {
    if (!tempAddress.name || !tempAddress.phone || !tempAddress.fullAddress) {
      setError("Mohon lengkapi semua bidang alamat yang wajib diisi.");
      return;
    }
    setError(null);
    setAddress(tempAddress);
    localStorage.setItem('marpay_address', JSON.stringify(tempAddress));
    setIsAddressModalOpen(false);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    if (!isDigital && !address) {
      setError("Mohon isi alamat pengiriman terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const adminWhatsApp = "6283851278935";
    const paymentLabels: Record<string, string> = {
      'bank_transfer': 'Bank Transfer',
      'e_wallet': 'E-Wallet (OVO/DANA/GoPay)',
      'qris': 'QRIS'
    };

    // Variabel dinamis dari form checkout asli
    const customerName = isDigital ? (items[0].details?.customerName || user?.displayName || 'Pelanggan Digital') : (address?.name || 'N/A');
    const customerPhone = isDigital ? (items[0].details?.target || 'N/A') : (address?.phone || 'N/A');
    const customerAddress = isDigital 
      ? 'Produk Digital (Pengiriman Instan)' 
      : `${address?.fullAddress}${address?.notes ? ` (${address?.notes})` : ''}`;

    const orderItemsList = items.map((item, index) => {
      return `${index + 1}. ${item.name}\n   Varian: ${item.variant || 'Default'}\n   Jumlah: ${item.quantity} pcs\n   Harga: Rp ${item.price.toLocaleString()}`;
    }).join('\n\n');

    const paymentMethodLabel = paymentLabels[selectedPayment] || selectedPayment;

    // FORMAT PESAN PROFESIONAL SESUAI PERMINTAAN
    let message = `🛍️ ORDER BARU MARPAY\n\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `👤 DATA PEMBELI\n`;
    message += `Nama : ${customerName}\n`;
    message += `No. WA : ${customerPhone}\n\n`;
    message += `📍 ALAMAT PENGIRIMAN\n`;
    message += `${customerAddress}\n\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `📦 DETAIL PESANAN\n\n`;
    message += `${orderItemsList}\n\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `💳 RINGKASAN PEMBAYARAN\n\n`;
    message += `Subtotal : Rp ${totalItemsPrice.toLocaleString()}\n`;
    message += `Ongkir : Rp ${totalShipping.toLocaleString()}\n`;
    message += `Total Bayar : Rp ${totalBill.toLocaleString()}\n\n`;
    message += `Metode Pembayaran :\n${paymentMethodLabel}\n\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `📌 STATUS\n`;
    message += `Menunggu Konfirmasi Admin\n\n`;
    message += `Mohon diproses.\n`;
    message += `Terima kasih 🙏`;

    localStorage.removeItem('marpay_checkout_temp');
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    
    // Redirect langsung ke WhatsApp
    window.location.href = whatsappUrl;
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3.5 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base font-bold">Checkout</h1>
      </header>

      <main className="pt-16 px-4 space-y-3.5">
        {!isDigital && (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wide">Alamat Pengiriman</h3>
              </div>
              <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogTrigger asChild>
                  <button className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    {address ? 'Ubah' : 'Tambah'}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl outline-none">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Lengkapi Alamat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nama Penerima</Label>
                      <Input placeholder="Nama lengkap" value={tempAddress.name} onChange={(e) => setTempAddress({...tempAddress, name: e.target.value})} className="rounded-xl border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp</Label>
                      <Input placeholder="08xxxxxxxx" value={tempAddress.phone} onChange={(e) => setTempAddress({...tempAddress, phone: e.target.value})} className="rounded-xl border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Alamat Lengkap</Label>
                      <Textarea placeholder="Nama jalan, nomor rumah, RT/RW" value={tempAddress.fullAddress} onChange={(e) => setTempAddress({...tempAddress, fullAddress: e.target.value})} className="rounded-xl border-gray-200 min-h-[100px]" />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-medium leading-tight">{error}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter className="pt-4">
                    <Button onClick={saveAddress} className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Simpan Alamat</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {address ? (
              <div className="space-y-0.5 border-t border-gray-50 pt-3">
                <p className="text-xs font-bold text-gray-900">{address.name} <span className="text-gray-400 font-normal ml-1">({address.phone})</span></p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{address.fullAddress}</p>
              </div>
            ) : (
              <div className="border-t border-gray-50 pt-4 text-center py-5 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 font-medium mb-2.5">Belum ada alamat pengiriman</p>
                <Button variant="outline" onClick={() => setIsAddressModalOpen(true)} className="text-primary font-bold text-[10px] h-8 rounded-lg border-primary/20 bg-white">+ Tambah Alamat</Button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded uppercase">M</span>
            <h3 className="text-xs font-bold uppercase tracking-wide">Daftar Barang</h3>
          </div>
          <div className="space-y-3.5">
            {items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-3.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 bg-gray-50 flex items-center justify-center">
                  <Image src={getProductImage(item)} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-gray-800 truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs font-bold text-primary">Rp {item.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">x{item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wide">Metode Pembayaran</h3>
          </div>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-2.5">
            {[
              { id: 'bank_transfer', label: 'Bank Transfer' },
              { id: 'e_wallet', label: 'E-Wallet (OVO/DANA/GoPay)' },
              { id: 'qris', label: 'QRIS' }
            ].map((pay) => (
              <div 
                key={pay.id}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all", 
                  selectedPayment === pay.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-50"
                )} 
                onClick={() => setSelectedPayment(pay.id)}
              >
                <p className="text-[11px] font-bold">{pay.label}</p>
                <RadioGroupItem value={pay.id} id={pay.id} className="sr-only" />
                {selectedPayment === pay.id && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide">Ringkasan Belanja</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center"><span className="text-[11px] text-gray-500 font-medium">Subtotal</span><span className="text-[11px] font-bold text-gray-800">Rp {totalItemsPrice.toLocaleString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-[11px] text-gray-500 font-medium">Ongkir</span><span className="text-[11px] font-bold text-primary">Rp {totalShipping.toLocaleString()}</span></div>
            <div className="border-t border-gray-50 pt-2.5 flex justify-between items-center"><span className="text-xs font-bold text-gray-900 uppercase">Total Tagihan</span><span className="text-base font-black text-primary">Rp {totalBill.toLocaleString()}</span></div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Total Pembayaran</p>
          <p className="text-base font-black text-primary leading-none">Rp {totalBill.toLocaleString()}</p>
        </div>
        <Button 
          onClick={handleWhatsAppCheckout} 
          className="bg-primary text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4" />
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}