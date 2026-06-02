
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, CreditCard, ChevronRight, Truck, 
  Smartphone, QrCode, Banknote, Edit3, MessageCircle, AlertCircle, Zap, Wallet
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
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    // LOGIC: Check for direct buy (Beli Sekarang) item first
    const tempItem = localStorage.getItem('marpay_checkout_temp');
    if (tempItem) {
      try {
        setItems(JSON.parse(tempItem));
      } catch (e) {
        console.error("Failed to parse temp checkout item");
      }
    } else {
      // Load from cart if no direct buy
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
    if (item.id === 3) return Math.max(acc, 12000);
    if (item.id === 4) return Math.max(acc, 9000);
    return acc;
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

    let message = `Halo Admin MarPay, saya ingin konfirmasi pesanan.\n\n`;

    if (isDigital) {
      const digitalDetails = items[0].details;
      message += `*Detail Pesanan Digital:*\n`;
      message += `Produk: ${items[0].name}\n`;
      message += `Nomor Tujuan: ${digitalDetails.target}\n`;
      message += `Operator: ${digitalDetails.operator}\n`;
      message += `Nominal: ${digitalDetails.nominal}\n\n`;
    } else if (address) {
      const productList = items.map(item => `- ${item.name} (Varian: ${item.variant || 'Default'}) x ${item.quantity}`).join('\n');
      message += `*Data Penerima:*\n`;
      message += `Nama: ${address.name}\n`;
      message += `Nomor WhatsApp: ${address.phone}\n`;
      message += `Alamat: ${address.fullAddress}, ${address.district}, ${address.city}, ${address.province} ${address.notes ? `(${address.notes})` : ''}\n\n`;
      message += `*Detail Pesanan:*\n${productList}\n\n`;
    }

    message += `*Pembayaran:*\n`;
    message += `Metode: ${paymentLabels[selectedPayment]}\n`;
    message += `Total Bayar: Rp ${totalBill.toLocaleString()}\n\n`;
    message += `Mohon dibantu proses pesanannya.`;

    // LOGIC: Clear appropriate storage after purchase
    if (localStorage.getItem('marpay_checkout_temp')) {
      localStorage.removeItem('marpay_checkout_temp');
    } else {
      localStorage.removeItem('marpay_cart');
      window.dispatchEvent(new Event('cart-updated'));
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderProductImage = (item: any) => {
    if (item.image === '/pulsa-icon.png') return <Smartphone className="w-8 h-8 text-primary" />;
    if (item.image === '/pln-icon.png') return <Zap className="w-8 h-8 text-primary" />;
    if (item.image === '/e-wallet-icon.png') return <Wallet className="w-8 h-8 text-primary" />;
    if (item.image) return <Image src={item.image} alt={item.name} fill className="object-cover" />;
    return <Smartphone className="w-8 h-8 text-primary/40" />;
  };

  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Checkout Kosong</h1>
        <p className="text-sm text-muted-foreground mb-6">Silakan pilih produk terlebih dahulu.</p>
        <Link href="/">
          <Button className="bg-primary text-white px-8 h-12 rounded-xl">Kembali Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Checkout</h1>
      </header>

      <main className="pt-20 px-4 space-y-4">
        {!isDigital && (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold">Alamat Pengiriman</h3>
              </div>
              <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogTrigger asChild>
                  <button className="text-xs font-bold text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    {address ? 'Ubah' : 'Tambah'}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Lengkapi Alamat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nama Penerima</Label>
                      <Input 
                        placeholder="Masukkan nama lengkap" 
                        value={tempAddress.name}
                        onChange={(e) => setTempAddress({...tempAddress, name: e.target.value})}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp</Label>
                      <Input 
                        placeholder="Contoh: 081234567890" 
                        value={tempAddress.phone}
                        onChange={(e) => setTempAddress({...tempAddress, phone: e.target.value})}
                        className="rounded-xl border-gray-200"
                      />
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
                  <DialogFooter>
                    <Button onClick={saveAddress} className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Simpan Alamat</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {address ? (
              <div className="space-y-0.5 border-t border-gray-50 pt-2">
                <p className="text-sm font-bold text-gray-900">{address.name} <span className="text-gray-400 font-normal ml-1">({address.phone})</span></p>
                <p className="text-xs text-gray-600 leading-relaxed">{address.fullAddress}, {address.district}, {address.city}, {address.province}</p>
              </div>
            ) : (
              <div className="border-t border-gray-50 pt-3 text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400 font-medium">Belum ada alamat pengiriman</p>
                <Button variant="link" onClick={() => setIsAddressModalOpen(true)} className="text-primary font-bold text-xs">+ Tambah Alamat</Button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold">{isDigital ? 'Detail Pesanan' : 'Daftar Barang'}</span>
          </div>
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 bg-gray-50 flex items-center justify-center">
                {renderProductImage(item)}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium line-clamp-1">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-bold text-primary">Rp {item.price.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">x{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold">Metode Pembayaran</h3>
          </div>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-2">
            <div className={cn("flex items-center justify-between p-3 rounded-xl border cursor-pointer", selectedPayment === 'bank_transfer' ? "border-primary bg-primary/5" : "border-gray-100")} onClick={() => setSelectedPayment('bank_transfer')}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Banknote className="w-5 h-5" /></div>
                <div><p className="text-xs font-bold">Bank Transfer</p></div>
              </div>
              <RadioGroupItem value="bank_transfer" id="bank_transfer" className="sr-only" />
              {selectedPayment === 'bank_transfer' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className={cn("flex items-center justify-between p-3 rounded-xl border cursor-pointer", selectedPayment === 'qris' ? "border-primary bg-primary/5" : "border-gray-100")} onClick={() => setSelectedPayment('qris')}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><QrCode className="w-5 h-5" /></div>
                <div><p className="text-xs font-bold">QRIS</p></div>
              </div>
              <RadioGroupItem value="qris" id="qris" className="sr-only" />
              {selectedPayment === 'qris' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </RadioGroup>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between font-bold">
            <span className="text-sm">Total Tagihan</span>
            <span className="text-lg text-primary">Rp {totalBill.toLocaleString()}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-[100]">
        <div className="flex flex-col">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
          <p className="text-lg font-bold text-primary leading-tight">Rp {totalBill.toLocaleString()}</p>
        </div>
        <Button onClick={handleWhatsAppCheckout} className="w-1/2 bg-primary text-white font-bold h-12 rounded-xl flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}
