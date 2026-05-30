'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Info, CheckCircle2, AlertCircle, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TOKEN_PRODUCTS = [
  { nominal: '20.000', price: 21000 },
  { nominal: '50.000', price: 50850 },
  { nominal: '100.000', price: 101000 },
];

export default function TokenPLNPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [meterId, setMeterId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [errors, setErrors] = useState<{ name?: string; meter?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; meter?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Nama wajib diisi';
    if (!meterId.trim()) newErrors.meter = 'Nomor meter wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validate() || !selectedProduct) return;

    const digitalItem = {
      id: `TOKEN-PLN-${selectedProduct.nominal}`,
      name: `Token PLN ${selectedProduct.nominal}`,
      price: selectedProduct.price,
      image: '/pln-icon.png',
      variant: meterId,
      quantity: 1,
      type: 'digital',
      details: {
        target: meterId,
        customerName: customerName,
        operator: 'PLN',
        nominal: selectedProduct.nominal
      }
    };

    localStorage.setItem('marpay_cart', JSON.stringify([digitalItem]));
    window.dispatchEvent(new Event('cart-updated'));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Token PLN</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Input Form Section */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nama Pelanggan</label>
            <div className="relative">
              <Input 
                placeholder="Masukkan nama pelanggan"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                className={cn(
                  "rounded-2xl h-12 text-base md:text-sm font-semibold border-gray-100 focus-visible:ring-primary/20 pl-4",
                  errors.name && "border-red-500 bg-red-50/30"
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nomor Meter / ID Pelanggan</label>
            <div className="relative">
              <Input 
                type="tel"
                placeholder="Contoh: 12345678901"
                value={meterId}
                onChange={(e) => {
                  setMeterId(e.target.value.replace(/[^0-9]/g, ''));
                  if (errors.meter) setErrors({...errors, meter: undefined});
                }}
                className={cn(
                  "rounded-2xl h-12 text-base md:text-sm font-semibold border-gray-100 focus-visible:ring-primary/20 pl-4",
                  errors.meter && "border-red-500 bg-red-50/30"
                )}
              />
              {errors.meter && (
                <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.meter}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Product Selection Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h2 className="text-sm font-bold text-gray-800">Pilih Nominal Token</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {TOKEN_PRODUCTS.map((product) => (
              <button
                key={product.nominal}
                onClick={() => setSelectedProduct(product)}
                className={cn(
                  "bg-white p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between group",
                  selectedProduct?.nominal === product.nominal 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md shadow-primary/5" 
                    : "border-gray-100 active:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    selectedProduct?.nominal === product.nominal ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  )}>
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 tracking-tight">TOKEN {product.nominal}</p>
                    <p className="text-[10px] font-bold text-gray-400">Harga: Rp {product.price.toLocaleString()}</p>
                  </div>
                </div>
                {selectedProduct?.nominal === product.nominal && (
                  <div className="bg-primary text-white rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
            Nomor token akan otomatis dikirimkan via WhatsApp setelah pembayaran terverifikasi. Pastikan Nomor Meter dan Nama Pelanggan sudah sesuai.
          </p>
        </div>
      </main>

      {/* Sticky Bottom Summary */}
      {selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-300">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
            <p className="text-lg font-bold text-primary leading-tight">Rp {selectedProduct.price.toLocaleString()}</p>
          </div>
          <Button 
            onClick={handleCheckout}
            className="w-1/2 bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Lanjut Bayar
          </Button>
        </div>
      )}
    </div>
  );
}
