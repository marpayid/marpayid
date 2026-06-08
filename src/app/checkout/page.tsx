'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, CreditCard, Edit3, MessageCircle, AlertCircle, Wallet, QrCode, Truck, Info,
  Smartphone, Zap, Gamepad2, Loader2, Ticket, CheckCircle2, X, ChevronRight
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
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { MasterVouchers } from '@/app/lib/dummy-data';

interface AddressData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  fullAddress: string;
  notes?: string;
}

const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard, iconColor: 'text-blue-500' },
  { id: 'e_wallet', label: 'E-Wallet (OVO/DANA/GoPay)', icon: Wallet, iconColor: 'text-emerald-500' },
  { id: 'qris', label: 'QRIS', icon: QrCode, iconColor: 'text-orange-500' }
];

export default function Checkout() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
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
  const [isFromCart, setIsFromCart] = useState(false);

  // Voucher States
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  useEffect(() => {
    const handleFocus = () => {
      const isRedirectPending = sessionStorage.getItem('marpay_checkout_pending');
      if (isRedirectPending) {
        sessionStorage.removeItem('marpay_checkout_pending');
        router.replace('/akun/transaksi');
      }
    };

    window.addEventListener('focus', handleFocus);
    handleFocus();

    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  useEffect(() => {
    const tempItem = localStorage.getItem('marpay_checkout_temp');
    if (tempItem) {
      try {
        setItems(JSON.parse(tempItem));
        setIsFromCart(false);
      } catch (e) {
        console.error("Failed to parse temp checkout item");
      }
    } else {
      const savedCart = localStorage.getItem('marpay_cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
          setIsFromCart(true);
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

  const totalItemsPrice = useMemo(() => items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0), [items]);
  
  const shippingDetails = useMemo(() => {
    let raw = 0;
    let autoDiscount = 0;

    items.forEach(item => {
      if (item.type === 'digital') return;
      
      const baseFee = (item.shippingFee && item.shippingFee > 0) ? item.shippingFee : 10000;
      const additional = Math.max(0, item.quantity - 1) * 5000;
      const totalItemShipping = baseFee + additional;
      
      raw += totalItemShipping;
      
      if (item.isFreeShipping === true || item.shippingFee === 0) {
        autoDiscount += totalItemShipping;
      }
    });

    return { 
      raw, 
      autoDiscount, 
      net: Math.max(0, raw - autoDiscount) 
    };
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    
    let discount = 0;
    if (appliedVoucher.discountType === 'fixed') {
      discount = appliedVoucher.discountValue;
    } else if (appliedVoucher.discountType === 'percent') {
      discount = (totalItemsPrice * appliedVoucher.discountValue) / 100;
    }

    return Math.min(discount, appliedVoucher.maxDiscount || discount);
  }, [appliedVoucher, totalItemsPrice]);

  const totalBill = Math.max(0, totalItemsPrice + shippingDetails.net - discountAmount);
  const isDigital = items.length > 0 && items.every(item => item.type === 'digital');

  const handleApplyVoucher = () => {
    setVoucherError(null);
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    const voucher = MasterVouchers.find(v => v.code === code);

    if (!voucher) {
      setVoucherError("Kode voucher tidak ditemukan.");
      return;
    }

    if (!voucher.isActive) {
      setVoucherError("Voucher sudah tidak aktif.");
      return;
    }

    if (new Date(voucher.expiredAt) < new Date()) {
      setVoucherError("Voucher telah kadaluarsa.");
      return;
    }

    if (totalItemsPrice < voucher.minPurchase) {
      setVoucherError(`Minimal belanja Rp ${voucher.minPurchase.toLocaleString()} untuk kode ini.`);
      return;
    }

    if (voucher.applicableCategory !== 'all') {
      const hasValidCategory = items.some(item => item.category === voucher.applicableCategory);
      if (!hasValidCategory) {
        setVoucherError(`Voucher hanya berlaku untuk kategori ${voucher.applicableCategory}.`);
        return;
      }
    }

    setAppliedVoucher(voucher);
    toast({ title: "Voucher Berhasil!", description: "Potongan harga telah diterapkan.", variant: "success" });
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

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
    if (items.length === 0 || isSubmitting) return;
    
    if (!isDigital && !address) {
      setError("Mohon isi alamat pengiriman terlebih dahulu.");
      const element = document.getElementById('address-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const adminWhatsApp = "6283851278935";
    const paymentMethodLabel = PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label || selectedPayment;

    const customerName = isDigital ? (items[0].details?.customerName || user?.displayName || 'Pelanggan Digital') : (address?.name || 'N/A');
    const customerPhone = isDigital ? (items[0].details?.target || 'N/A') : (address?.phone || 'N/A');
    const customerAddress = isDigital 
      ? 'Produk Digital (Pengiriman Instan)' 
      : `${address?.fullAddress}${address?.notes ? ` (${address?.notes})` : ''}, ${address?.district}, ${address?.city}, ${address?.province}`;

    const orderItemsList = items.map((item, index) => {
      return `${index + 1}. ${item.name}\n   Varian: ${item.variant || 'Default'}\n   Jumlah: ${item.quantity} pcs\n   Harga: Rp ${item.price.toLocaleString()}`;
    }).join('\n\n');

    const now = new Date();
    const expireTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    try {
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
      if (appliedVoucher) {
        message += `🎟️ VOUCHER: ${appliedVoucher.code} (-Rp ${discountAmount.toLocaleString()})\n\n`;
      }
      if (shippingDetails.autoDiscount > 0) {
        message += `🚚 GRATIS ONGKIR: (-Rp ${shippingDetails.autoDiscount.toLocaleString()})\n\n`;
      }
      message += `━━━━━━━━━━━━━━\n\n`;
      message += `💳 RINGKASAN PEMBAYARAN\n\n`;
      message += `Subtotal : Rp ${totalItemsPrice.toLocaleString()}\n`;
      message += `Ongkir : Rp ${shippingDetails.raw.toLocaleString()}\n`;
      if (appliedVoucher) message += `Diskon : -Rp ${discountAmount.toLocaleString()}\n`;
      if (shippingDetails.autoDiscount > 0) message += `Potongan Ongkir : -Rp ${shippingDetails.autoDiscount.toLocaleString()}\n`;
      message += `Total Bayar : Rp ${totalBill.toLocaleString()}\n\n`;
      message += `Metode Pembayaran :\n${paymentMethodLabel}\n\n`;
      message += `━━━━━━━━━━━━━━\n\n`;
      message += `📌 STATUS\n`;
      message += `Menunggu Konfirmasi Admin\n\n`;
      message += `Mohon diproses.\n`;
      message += `Terima kasih 🙏`;

      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;

      sessionStorage.setItem('marpay_checkout_pending', 'true');

      addDoc(collection(db, 'orders'), {
        userId: user?.uid || 'guest',
        customerName,
        customerPhone,
        customerEmail: user?.email || '',
        items,
        totalAmount: totalBill,
        discountAmount: discountAmount + shippingDetails.autoDiscount,
        voucherUsed: appliedVoucher?.code || null,
        autoFreeShipping: shippingDetails.autoDiscount > 0,
        status: 'Menunggu Konfirmasi',
        paymentStatus: 'Menunggu Pembayaran',
        paymentMethod: paymentMethodLabel,
        shippingAddress: isDigital ? { fullAddress: 'Digital' } : address,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiredAt: Timestamp.fromDate(expireTime)
      }).catch((err) => {
        console.error("Firestore Save Error:", err);
      });

      if (!isFromCart) {
        localStorage.removeItem('marpay_checkout_temp');
      } else {
        localStorage.removeItem('marpay_cart');
      }
      
      window.dispatchEvent(new Event('cart-updated'));
      window.location.href = whatsappUrl;
      setTimeout(() => setIsSubmitting(false), 2000);

    } catch (e) {
      console.error("Process Checkout Error:", e);
      toast({
        variant: "destructive",
        title: "Gagal Membuat Pesanan",
        description: "Terjadi kesalahan teknis. Silakan coba lagi.",
      });
      setIsSubmitting(false);
    }
  };

  const renderItemMedia = (item: any) => {
    if (item.type === 'digital') {
      const name = item.name?.toLowerCase() || '';
      let Icon = CreditCard;
      let iconColor = "text-primary";
      let bgColor = "bg-primary/5";
      if (name.includes('dana')) { Icon = Wallet; iconColor = "text-emerald-500"; bgColor = "bg-emerald-50"; }
      else if (name.includes('ovo')) { Icon = Wallet; iconColor = "text-purple-500"; bgColor = "bg-purple-50"; }
      else if (name.includes('gopay')) { Icon = Wallet; iconColor = "text-blue-500"; bgColor = "bg-blue-50"; }
      else if (name.includes('pulsa')) { Icon = Smartphone; iconColor = "text-blue-500"; bgColor = "bg-blue-50"; }
      else if (name.includes('pln')) { Icon = Zap; iconColor = "text-yellow-600"; bgColor = "bg-yellow-50"; }
      else if (name.includes('game')) { Icon = Gamepad2; iconColor = "text-indigo-500"; bgColor = "bg-indigo-50"; }
      return (
        <div className={cn("w-full h-full flex items-center justify-center rounded-xl", bgColor)}>
          <Icon className={cn("w-7 h-7", iconColor)} />
        </div>
      );
    }
    return <Image src={getProductImage(item)} alt={item.name} fill className="object-cover" />;
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3.5 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => {
          localStorage.removeItem('marpay_checkout_temp');
          router.back();
        }}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base font-bold">Checkout</h1>
      </header>

      <main className="pt-16 px-4 space-y-3.5">
        {!isDigital && (
          <div id="address-section" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
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
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Provinsi</Label>
                        <Input placeholder="Provinsi" value={tempAddress.province} onChange={(e) => setTempAddress({...tempAddress, province: e.target.value})} className="rounded-xl border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Kota/Kab</Label>
                        <Input placeholder="Kota/Kab" value={tempAddress.city} onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})} className="rounded-xl border-gray-200" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Alamat Lengkap</Label>
                      <Textarea placeholder="Nama jalan, nomor rumah, RT/RW" value={tempAddress.fullAddress} onChange={(e) => setTempAddress({...tempAddress, fullAddress: e.target.value})} className="rounded-xl border-gray-200 min-h-[80px]" />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-medium leading-tight">{error}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter className="pt-2">
                    <Button onClick={saveAddress} className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Simpan Alamat</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {address ? (
              <div className="space-y-0.5 border-t border-gray-50 pt-3">
                <p className="text-xs font-bold text-gray-900">{address.name} <span className="text-gray-400 font-normal ml-1">({address.phone})</span></p>
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{address.fullAddress}</p>
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
            <div className="bg-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded">M</div>
            <h3 className="text-xs font-bold uppercase tracking-wide">Daftar Barang</h3>
          </div>
          <div className="space-y-3.5">
            {items.map((item, idx) => {
              const hasFreeShipping = item.isFreeShipping === true || item.shippingFee === 0;
              return (
                <div key={`${item.id}-${idx}`} className="flex gap-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 bg-gray-50">
                    {renderItemMedia(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-gray-800 truncate">{item.name}</h4>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium truncate">Varian: {item.variant || 'Default'}</p>
                      {item.type !== 'digital' && (
                        <div className="flex items-center gap-1.5">
                           <p className="text-[10px] text-gray-400 font-medium">Ongkir:</p>
                           {hasFreeShipping ? (
                             <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">Gratis</span>
                           ) : (
                             <p className="text-[10px] text-gray-400 font-medium">Rp {item.shippingFee?.toLocaleString()}</p>
                           )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs font-bold text-primary">Rp {item.price.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">x{item.quantity}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voucher Section (Marketplace Style) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between group active:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-gray-800">Voucher</span>
              
              <div className="flex items-center gap-1.5 ml-2.5">
                {appliedVoucher && (
                  <div className="px-2 py-0.5 border border-red-200 rounded-sm bg-white text-[9px] font-black text-red-500 uppercase tracking-tighter">
                    -Rp{discountAmount >= 1000 ? (discountAmount/1000).toFixed(0) + 'RB' : discountAmount}
                  </div>
                )}
                {shippingDetails.autoDiscount > 0 && (
                  <div className="px-2 py-0.5 border border-emerald-200 rounded-sm bg-white text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                    Gratis Ongkir
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          
          {appliedVoucher ? (
            <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl animate-in zoom-in-95 duration-200">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                   <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-emerald-800 uppercase leading-none">{appliedVoucher.code}</p>
                   <p className="text-[9px] text-emerald-600 font-medium mt-1">Berhasil hemat Rp {discountAmount.toLocaleString()}</p>
                 </div>
               </div>
               <button onClick={removeVoucher} className="p-1.5 text-emerald-400 hover:text-red-500">
                 <X className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <div className="space-y-2">
               <div className="flex gap-2">
                 <Input 
                   placeholder="Punya kode voucher?" 
                   value={voucherCode} 
                   onChange={(e) => setVoucherCode(e.target.value)}
                   className="rounded-xl border-gray-100 bg-gray-50/50 h-10 text-xs font-medium uppercase placeholder:normal-case" 
                 />
                 <Button 
                   onClick={handleApplyVoucher}
                   variant="outline" 
                   className="rounded-xl border-primary/20 text-primary font-bold text-xs h-10 px-5 active:scale-95 transition-transform"
                 >
                   Pakai
                 </Button>
               </div>
               {voucherError && (
                 <p className="text-[9px] text-red-500 font-medium ml-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> {voucherError}
                 </p>
               )}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wide">Metode Pembayaran</h3>
          </div>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-2.5">
            {PAYMENT_METHODS.map((pay) => {
              const Icon = pay.icon;
              return (
                <div 
                  key={pay.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all", 
                    selectedPayment === pay.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-50"
                  )} 
                  onClick={() => setSelectedPayment(pay.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", pay.iconColor)} />
                    <p className="text-[11px] font-bold">{pay.label}</p>
                  </div>
                  <RadioGroupItem value={pay.id} id={pay.id} className="sr-only" />
                  {selectedPayment === pay.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              );
            })}
          </RadioGroup>
          <div className="mt-4 bg-blue-50/80 p-3.5 rounded-xl border border-blue-100 flex gap-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700/80 leading-relaxed font-medium">
              Pesanan akan diproses melalui WhatsApp Admin MarPay untuk memastikan transaksi berjalan aman dan cepat.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide">Ringkasan Belanja</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center"><span className="text-[11px] text-gray-500 font-medium">Subtotal</span><span className="text-[11px] font-bold text-gray-800">Rp {totalItemsPrice.toLocaleString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-[11px] text-gray-500 font-medium">Ongkir</span><span className="text-[11px] font-bold text-gray-800">Rp {shippingDetails.raw.toLocaleString()}</span></div>
            
            {/* Tampilan Diskon Ongkir */}
            {shippingDetails.autoDiscount > 0 && (
              <div className="flex justify-between items-center bg-emerald-50/30 -mx-1 px-1 rounded">
                <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Gratis Ongkir
                </span>
                <span className="text-[11px] font-bold text-emerald-600">-Rp {shippingDetails.autoDiscount.toLocaleString()}</span>
              </div>
            )}

            {appliedVoucher && (
              <div className="flex justify-between items-center"><span className="text-[11px] text-emerald-600 font-medium">Diskon Voucher ({appliedVoucher.code})</span><span className="text-[11px] font-bold text-emerald-600">-Rp {discountAmount.toLocaleString()}</span></div>
            )}
            
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
          disabled={isSubmitting}
          onClick={handleWhatsAppCheckout} 
          className="bg-primary text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}
