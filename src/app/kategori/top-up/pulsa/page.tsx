
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Info, CheckCircle2, AlertCircle, Signal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Operator Data
const OPERATORS = [
  {
    name: 'TELKOMSEL',
    prefixes: ['0811', '0812', '0813', '0821', '0822', '0852', '0853', '0851'],
    products: [
      { nominal: '5.000', price: 5850 },
      { nominal: '10.000', price: 10850 },
      { nominal: '20.000', price: 20650 },
      { nominal: '30.000', price: 31085 },
      { nominal: '50.000', price: 50890 },
    ]
  },
  {
    name: 'AXIS',
    prefixes: ['0831', '0832', '0833', '0838'],
    products: [
      { nominal: '5.000', price: 6350 },
      { nominal: '15.000', price: 15850 },
      { nominal: '25.000', price: 25999 },
      { nominal: '40.000', price: 41650 },
      { nominal: '50.000', price: 51555 },
    ]
  },
  {
    name: 'IM3',
    prefixes: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    products: [
      { nominal: '10.000', price: 12555 },
      { nominal: '15.000', price: 16750 },
      { nominal: '20.000', price: 21555 },
    ]
  },
  {
    name: 'TRI',
    prefixes: ['0895', '0896', '0897', '0898', '0899'],
    products: [
      { nominal: '5.000', price: 6333 },
      { nominal: '15.000', price: 15999 },
      { nominal: '25.000', price: 25650 },
    ]
  },
  {
    name: 'SMARTFREN',
    prefixes: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
    products: [
      { nominal: '5.000', price: 6000 },
      { nominal: '8.000', price: 8999 },
      { nominal: '12.000', price: 13030 },
      { nominal: '25.000', price: 25850 },
      { nominal: '50.000', price: 51850 },
    ]
  }
];

export default function PulsaPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (phoneNumber.length > 0 && phoneNumber.length < 4) {
      setIsSearching(true);
      setDetectedOperator(null);
    } else if (phoneNumber.length >= 4) {
      setIsSearching(false);
      const prefix = phoneNumber.substring(0, 4);
      const operator = OPERATORS.find(op => op.prefixes.includes(prefix));
      setDetectedOperator(operator || 'not_found');
    } else {
      setIsSearching(false);
      setDetectedOperator(null);
      setSelectedProduct(null);
    }
  }, [phoneNumber]);

  const handleCheckout = () => {
    if (!selectedProduct || !detectedOperator || detectedOperator === 'not_found') return;

    const digitalItem = {
      id: `PULSA-${detectedOperator.name}-${selectedProduct.nominal}`,
      name: `Pulsa ${detectedOperator.name} ${selectedProduct.nominal}`,
      price: selectedProduct.price,
      image: '/pulsa-icon.png',
      variant: phoneNumber,
      quantity: 1,
      type: 'digital',
      details: {
        target: phoneNumber,
        operator: detectedOperator.name,
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
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Isi Pulsa</h1>
      </header>

      <main className="pt-20 px-4">
        {/* Phone Number Input Section */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Nomor Telepon</label>
          <div className="relative">
            <Input 
              type="tel"
              placeholder="Contoh: 0812xxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              className="rounded-2xl h-14 text-lg font-bold border-gray-100 focus-visible:ring-primary/20 pl-4 pr-12 placeholder:font-normal placeholder:text-gray-300"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                isSearching ? "bg-primary/5 text-primary animate-pulse" : 
                detectedOperator && detectedOperator !== 'not_found' ? "bg-primary/10 text-primary" :
                detectedOperator === 'not_found' ? "bg-red-50 text-red-500" :
                "bg-gray-50 text-gray-300"
              )}>
                {isSearching ? (
                  <Search className="w-5 h-5" />
                ) : detectedOperator === 'not_found' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Signal className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>
          
          {detectedOperator === 'not_found' && (
            <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold">Operator tidak dikenali</span>
            </div>
          )}
          
          {detectedOperator && detectedOperator !== 'not_found' && (
            <div className="mt-3 flex items-center gap-2 text-primary bg-primary/5 p-2.5 rounded-xl border border-primary/10 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold">Operator Terdeteksi: <span className="uppercase">{detectedOperator.name}</span></span>
            </div>
          )}
        </section>

        {/* Product Selection Section */}
        {detectedOperator && detectedOperator !== 'not_found' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <h2 className="text-sm font-bold text-gray-800">Pilih Nominal</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {detectedOperator.products.map((product: any) => (
                <button
                  key={product.nominal}
                  onClick={() => setSelectedProduct(product)}
                  className={cn(
                    "bg-white p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                    selectedProduct?.nominal === product.nominal 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md shadow-primary/5" 
                      : "border-gray-100 active:bg-gray-50 active:scale-95"
                  )}
                >
                  {selectedProduct?.nominal === product.nominal && (
                    <div className="absolute top-0 right-0 p-1 bg-primary text-white rounded-bl-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-gray-400 mb-1">PULSA</p>
                  <p className="text-base font-black text-gray-800 tracking-tight">{product.nominal}</p>
                  <p className="text-xs font-bold text-primary mt-2">Rp {product.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
               <Smartphone className="w-10 h-10" />
             </div>
             <p className="text-sm font-medium text-gray-500 max-w-[200px]">Masukkan nomor telepon untuk melihat pilihan pulsa.</p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
            Pulsa akan langsung terkirim secara otomatis setelah pembayaran dikonfirmasi oleh admin. Pastikan nomor yang Anda masukkan sudah benar.
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
