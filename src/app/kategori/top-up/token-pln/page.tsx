
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

    // LOGIC: Save to temp storage for Direct Buy, do NOT add to cart
    localStorage.setItem('marpay_checkout_temp', JSON.stringify([digitalItem]));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Token PLN</h1>
      </header>

      <main className="pt-20 px-4">
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nama Pelanggan</label>
            <Input placeholder="Masukkan nama pelanggan" value={customerName} onChange={(e) => { setCustomerName(e.target.value); if (errors.name) setErrors({...errors, name: undefined}); }} className={cn("rounded-2xl h-12 border-gray-100", errors.name && "border-red-500")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nomor Meter / ID Pelanggan</label>
            <Input type="tel" placeholder="Contoh: 12345678901" value={meterId} onChange={(e) => { setMeterId(e.target.value.replace(/[^0-9]/g, '')); if (errors.meter) setErrors({...errors, meter: undefined}); }} className={cn("rounded-2xl h-12 border-gray-100", errors.meter && "border-red-500")} />
          </div>
        </section>

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
                  "bg-white p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between group",
                  selectedProduct?.nominal === product.nominal ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedProduct?.nominal === product.nominal ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">TOKEN {product.nominal}</p>
                    <p className="text-[10px] font-bold text-gray-400">Harga: Rp {product.price.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
            <p className="text-lg font-bold text-primary leading-tight">Rp {selectedProduct.price.toLocaleString()}</p>
          </div>
          <Button onClick={handleCheckout} className="w-1/2 bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">Lanjut Bayar</Button>
        </div>
      )}
    </div>
  );
}
