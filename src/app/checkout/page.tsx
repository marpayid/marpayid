'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, CreditCard, Truck, 
  Smartphone, QrCode, Banknote, Edit3, MessageCircle, AlertCircle, Zap, Wallet,
  Info, Loader2
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
} from '@/components/ui/dialog';
import Image from 'next/image';
import { cn, getProductImage } from '@/lib/utils';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  const db = useFirestore();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const baseFee = item.shippingFee;
    const additionalFee = Math.max(0, item.quantity - 1) * 5000;
    return acc + (baseFee + additionalFee);
  }, 0);

  const totalBill = totalItemsPrice + totalShipping;
  const isDigital = items.length > 0 && items.every(item => item.type === 'digital');

  const saveAddress = () => {
    if (!tempAddress.name || !tempAddress.phone || !tempAddress.province || 
        !tempAddress.city || !tempAddress.district || !tempAddress.fullAddress) {
      setError("Mohon lengkapi semua bidang alamat yang wajib diisi.");
      return;
    }
    setError(null);
    setAddress(tempAddress);
    localStorage.setItem('marpay_address', JSON.stringify(tempAddress));
    setIsAddressModalOpen(false);
  };

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;

    if (!isDigital && !address) {
      setError("Mohon isi alamat pengiriman terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Simpan pesanan ke Firestore terlebih dahulu
      const orderData = {
        userId: user?.uid || 'guest',
        customerName: isDigital ? (items[0].details?.customerName || 'Digital Customer') : (address?.name || 'Customer'),
        customerEmail: user?.email || 'N/A',
        customerPhone: isDigital ? (items[0].details?.target || 'N/A') : (address?.phone || 'N/A'),
        items: items,
        totalAmount: totalBill,
        status: 'Menunggu Pembayaran',
        paymentMethod: selectedPayment,
        shippingAddress: address || null,
        createdAt: serverTimestamp(),
      };

      // Mutation call without await for instant local cache update, but we await here to ensure storage before WA
      await addDoc(collection(db, 'orders'), orderData);

      // 2. Siapkan Pesan WhatsApp
      const adminWhatsApp = "6283851278935";
      const paymentLabels: Record<string, string> = {
        'bank_transfer': 'Bank Transfer',
        'e_wallet': 'E-Wallet (OVO/DANA/GoPay)',
        'qris': 'QRIS'
      };

      let message = `Halo Admin MarPay, saya ingin konfirmasi pesanan.\n\n`;

      if (isDigital) {
        const digitalDetails = items[0].details;
        message += `*Detail Pesanan Digital:*\n`;
        message += `Produk: ${items[0].name}\n`;
        message += `Nomor Tujuan: ${digitalDetails?.target}\n`;
        message += `Operator: ${digitalDetails?.operator}\n`;
        message += `Nominal: ${digitalDetails?.nominal}\n\n`;
      } else if (address) {
        const productList = items.map(item => {
          const itemShipping = (item.shippingFee || 0) > 0 
            ? item.shippingFee + (Math.max(0, item.quantity - 1) * 5000) 
            : 0;
          const shippingStr = itemShipping > 0 ? `Rp ${itemShipping.toLocaleString()}` : 'Gratis';
          return `- ${item.name} (Varian: ${item.variant || 'Default'}) x ${item.quantity} (Ongkir: ${shippingStr})`;
        }).join('\n');

        message += `*Data Penerima:*\n`;
        message += `Nama: ${address.name}\n`;
        message += `Nomor WhatsApp: ${address.phone}\n`;
        message += `Alamat: ${address.fullAddress}, ${address.district}, ${address.city}, ${address.province} ${address.notes ? `(${address.notes})` : ''}\n\n`;
        message += `*Detail Pesanan:*\n${productList}\n\n`;
      }

      message += `*Ringkasan Tagihan:*\n`;
      message += `Total Produk: Rp ${totalItemsPrice.toLocaleString()}\n`;
      message += `Total Ongkir: Rp ${totalShipping.toLocaleString()}\n`;
      message += `Total Bayar: Rp ${totalBill.toLocaleString()}\n\n`;
      message += `*Pembayaran:*\n`;
      message += `Metode: ${paymentLabels[selectedPayment]}\n\n`;
      message += `Mohon dibantu proses pesanannya.`;

      // 3. Bersihkan data temp
      localStorage.removeItem('marpay_checkout_temp');
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      
      // Arahkan ke halaman riwayat setelah checkout
      router.push('/akun/transaksi');

    } catch (e) {
      console.error("Checkout Error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProductImage = (item: any) => {
    if (item.category === 'Premium' || item.category?.toLowerCase() === 'premium') {
      return <div className="relative w-full h-full"><Image src="/premium1.png" alt="Premium" fill className="object-cover" /></div>;
    }
    
    if (item.image === '/pulsa-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Smartphone className="w-7 h-7" /></div>;
    if (item.image === '/pln-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Zap className="w-7 h-7" /></div>;
    if (item.image === '/e-wallet-icon.png') return <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-lg text-primary"><Wallet className="w-7 h-7" /></div>;
    
    const displayImage = getProductImage(item);
    if (displayImage) return <Image src={displayImage} alt={item.name} fill className="object-cover" />;
    return <Smartphone className="w-7 h-7 text-primary/40" />;
  };

  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-lg font-bold mb-2">Checkout Kosong</h1>
        <p className="text-xs text-muted-foreground mb-6">Silakan pilih produk terlebih dahulu.</p>
        <Link href="/">
          <Button className="bg-primary text-white px-8 h-11 rounded-xl">Kembali Belanja</Button>
        </Link>
      </div>
    );
  }

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
                <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[85vh] overflow-y-auto outline-none">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg font-bold">Lengkapi Alamat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nama Penerima</Label>
                      <Input placeholder="Masukkan nama lengkap" value={tempAddress.name} onChange={(e) => setTempAddress({...tempAddress, name: e.target.value})} className="rounded-xl border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp</Label>
                      <Input placeholder="Contoh: 081234567890" value={tempAddress.phone} onChange={(e) => setTempAddress({...tempAddress, phone: e.target.value})} className="rounded-xl border-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Provinsi</Label>
                        <Input placeholder="Provinsi" value={tempAddress.province} onChange={(e) => setTempAddress({...tempAddress, province: e.target.value})} className="rounded-xl border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Kota/Kabupaten</Label>
                        <Input placeholder="Kota/Kab" value={tempAddress.city} onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})} className="rounded-xl border-gray-200" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Kecamatan</Label>
                      <Input placeholder="Kecamatan" value={tempAddress.district} onChange={(e) => setTempAddress({...tempAddress, district: e.target.value})} className="rounded-xl border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Alamat Lengkap</Label>
                      <Textarea placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan" value={tempAddress.fullAddress} onChange={(e) => setTempAddress({...tempAddress, fullAddress: e.target.value})} className="rounded-xl border-gray-200 min-h-[100px]" />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-medium leading-tight">{error}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter className="pt-4 pb-6 sm:pb-4">
                    <Button onClick={saveAddress} className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Simpan Alamat</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {address ? (
              <div className="space-y-0.5 border-t border-gray-50 pt-3">
                <p className="text-xs font-bold text-gray-900">{address.name} <span className="text-gray-400 font-normal ml-1">({address.phone})</span></p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{address.fullAddress}, {address.district}, {address.city}, {address.province}</p>
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
            {items.map((item, idx) => {
              const itemShipping = (item.shippingFee || 0) > 0 
                ? item.shippingFee + (Math.max(0, item.quantity - 1) * 5000) 
                : 0;

              return (
                <div key={`${item.id}-${idx}`} className="flex gap-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 bg-gray-50 flex items-center justify-center">
                    {renderProductImage(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-gray-800 truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs font-bold text-primary">Rp {item.price.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">x{item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[9px] text-gray-400 font-medium">Varian: {item.variant || 'Default'}</p>
                      <p className="text-[9px] text-gray-500 italic">
                        Ongkir: {itemShipping > 0 ? `Rp ${itemShipping.toLocaleString()}` : 'Gratis'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-gray-500 font-bold uppercase">Total Pengiriman</span>
            </div>
            <span className={cn("text-[10px] font-bold", totalShipping === 0 ? "text-green-500" : "text-primary")}>
              {totalShipping === 0 ? 'Gratis' : `Rp ${totalShipping.toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wide">Metode Pembayaran</h3>
          </div>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-2.5">
            <div className={cn(
              "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all", 
              selectedPayment === 'bank_transfer' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-50"
            )} onClick={() => setSelectedPayment('bank_transfer')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Banknote className="w-5 h-5" /></div>
                <div><p className="text-[11px] font-bold">Bank Transfer</p><p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Konfirmasi Manual</p></div>
              </div>
              <RadioGroupItem value="bank_transfer" id="bank_transfer" className="sr-only" />
              {selectedPayment === 'bank_transfer' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            
            <div className={cn(
              "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all", 
              selectedPayment === 'e_wallet' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-50"
            )} onClick={() => setSelectedPayment('e_wallet')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Smartphone className="w-5 h-5" /></div>
                <div><p className="text-[11px] font-bold">E-Wallet</p><p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">OVO / DANA / GoPay</p></div>
              </div>
              <RadioGroupItem value="e_wallet" id="e_wallet" className="sr-only" />
              {selectedPayment === 'e_wallet' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>

            <div className={cn(
              "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all", 
              selectedPayment === 'qris' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-50"
            )} onClick={() => setSelectedPayment('qris')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><QrCode className="w-5 h-5" /></div>
                <div><p className="text-[11px] font-bold">QRIS</p><p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Scan & Bayar</p></div>
              </div>
              <RadioGroupItem value="qris" id="qris" className="sr-only" />
              {selectedPayment === 'qris' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </RadioGroup>
          <div className="bg-blue-50/50 p-3 rounded-2xl flex gap-2.5 border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
              Konfirmasi pesanan melalui WhatsApp admin MarPay setelah pembayaran dilakukan untuk proses pengiriman instan.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide">Ringkasan Belanja</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center"><span className="text-[11px] text-gray-500 font-medium">Total Harga Produk</span><span className="text-[11px] font-bold text-gray-800">Rp {totalItemsPrice.toLocaleString()}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-500 font-medium">Total Biaya Pengiriman</span>
              <span className={cn("text-[11px] font-bold", totalShipping === 0 ? "text-green-500" : "text-primary")}>
                {totalShipping === 0 ? 'Gratis' : `Rp ${totalShipping.toLocaleString()}`}
              </span>
            </div>
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
          disabled={isSubmitting}
          className="bg-primary text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}
