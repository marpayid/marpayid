
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import { BottomNav } from '@/components/bottom-nav';

export default function GenericCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const categoryNameMap: Record<string, string> = {
    'kecantikan': 'Kecantikan',
    'fashion': 'Fashion',
    'elektronik': 'Elektronik',
    'voucher': 'Voucher',
    'hobi': 'Hobi',
    'aksesoris-hp': 'Aksesoris HP'
  };

  const displayName = categoryNameMap[slug] || slug;
  
  const filteredProducts = Products.filter(p => 
    p.category?.toLowerCase() === slug.toLowerCase() ||
    p.category?.toLowerCase() === displayName.toLowerCase() ||
    (slug === 'kecantikan' && (p.category === 'Skincare' || p.category === 'Kecantikan'))
  );

  const getEmptyMessage = () => {
    if (slug === 'elektronik') return "Belum ada produk elektronik.";
    if (slug === 'voucher') return "Voucher belum tersedia.";
    return `Belum ada produk di kategori ${displayName}.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900 capitalize">{displayName}</h1>
      </header>

      <main className="pt-20 px-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">{getEmptyMessage()}</h3>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Coba cek kategori lainnya ya!</p>
            <Button onClick={() => router.push('/')} className="mt-6 bg-primary text-white rounded-2xl px-8 h-12 font-bold">
              Kembali ke Beranda
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
