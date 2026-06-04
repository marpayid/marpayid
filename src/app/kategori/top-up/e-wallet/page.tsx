'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Info, CheckCircle2, AlertCircle, User, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PROVIDERS = [
  { 
    id: 'DANA', 
    name: 'DANA', 
    products: [
      { nominal: '5.000', price: 5300 },
      { nominal: '10.000', price: 10300 },
      { nominal: '20.000', price: 20500 },
      { nominal: '30.000', price: 31850 },
      { nominal: '40.000', price: 41850 },
      { nominal: '50.000', price: 51730 },
      { nominal: '75.000', price: 76320 },
      { nominal: '85.000', price: 86320 },
      { nominal: '100.000', price: 101850 },
    ]
  },
  { 
    id: 'OVO', 
    name: 'OVO', 
    products: [
      { nominal: '20.000', price: 21100 },
      { nominal: '30.000', price: 31777 },
      { nominal: '50.000', price: 52500 },
    ]
  },
  { 
    id: 'GOPAY', 
    name: 'GoPay', 
    products: [
      { nominal: '10.000', price: 11350 },
      { nominal: '20.000', price: 21350 },
      { nominal: '25.000', price: 26350 },
      { nominal: '40.000', price: 42100 },
      { nominal: '50.000', price: 52085 },
    ]
  },
  { 
    id: 'SHOPEEPAY', 
    name: 'ShopeePay', 
    products: [
      { nominal: '10.000', price: 10750 },
      { nominal: '15.000', price: 15850 },
      { nominal: '20.000', price: 21085 },
      { nominal: '25.000', price: 25900 },
      { nominal: '50.000', price: 51985 },
    ]
  },
];

export default function EWalletPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [errors, setErrors] = useState<{ name?: string; wallet?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; wallet?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Nama wajib diisi';
    if (!walletNumber.trim()) newErrors.wallet = 'Nomor e-wallet wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validate() || !selectedProduct) return;

    const digitalItem = {
      id: `EWALLET-${selectedProvider.id}-${selectedProduct.nominal}`,
      name: `Saldo ${selectedProvider.name} ${selectedProduct.nominal}`,
      price: selectedProduct.price,
      image: '/e-wallet-icon.png',
      variant: walletNumber,
      quantity: 1,
      type: 'digital',
      shippingFee: 0,
      details: {
        target: walletNumber,
        customerName: customerName,
        operator: selectedProvider.name,
        nominal: selectedProduct.nominal
      }
    };

    localStorage.setItem('marpay_checkout_temp', JSON.stringify([digitalItem]));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Top Up E-Wallet</h1>
      </header>

      <main className="pt-20 px-4">
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nama Lengkap *</label>
            <Input placeholder="Masukkan nama lengkap" value={customerName} onChange={(e) => { setCustomerName(e.target.value); if (errors.name) setErrors({...errors, name: undefined}); }} className={cn("rounded-2xl h-12", errors.name && "border-red-500")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Nomor E-Wallet *</label>
            <Input type="tel" placeholder="Masukkan nomor e-wallet" value={walletNumber} onChange={(e) => { setWalletNumber(e.target.value.replace(/[^0-9]/g, '')); if (errors.wallet) setErrors({...errors, wallet: undefined}); }} className={cn("rounded-2xl h-12", errors.wallet && "border-red-500")} />
          </div>
        </section>

        <section className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-4 overflow-x-auto no-scrollbar">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Pilih E-Wallet</h2>
          <div className="flex gap-3 min-w-max px-1">
            {PROVIDERS.map((provider) => (
              <button 
                key={provider.id} 
                onClick={() => { setSelectedProvider(provider); setSelectedProduct(null); }} 
                className={cn(
                  "flex flex-col items-center justify-center w-20 p-2 rounded-2xl border transition-all gap-1.5", 
                  selectedProvider.id === provider.id ? "border-primary bg-primary/5 text-primary" : "border-gray-50 text-gray-400"
                )}
              >
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", selectedProvider.id === provider.id ? "bg-primary text-white" : "bg-gray-100")}>
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-black uppercase text-center leading-none">{provider.name}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h2 className="text-sm font-bold text-gray-800">Pilih Nominal</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {selectedProvider.products.map((product) => (
              <button
                key={product.nominal}
                onClick={() => setSelectedProduct(product)}
                className={cn(
                  "bg-white p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between",
                  selectedProduct?.nominal === product.nominal ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedProduct?.nominal === product.nominal ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">SALDO {product.nominal}</p>
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
