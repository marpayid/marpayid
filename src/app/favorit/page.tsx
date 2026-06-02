
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Star, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getProductImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWishlist = () => {
      const saved = localStorage.getItem('marpay_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse wishlist");
        }
      }
    };
    loadWishlist();
    setIsLoaded(true);
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => window.removeEventListener('wishlist-updated', loadWishlist);
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('marpay_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
    
    toast({
      variant: "default",
      title: "Favorit Dihapus",
      description: "Produk telah dihapus dari daftar favorit.",
      duration: 2000,
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Favorit Saya</h1>
      </header>

      <main className="pt-20 px-4">
        {wishlist.length > 0 ? (
          <div className="space-y-3">
            {wishlist.map((item) => (
              <Link 
                key={item.id} 
                href={`/product/${item.id}`}
                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-4 active:scale-[0.98] transition-all"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                  <Image src={getProductImage(item)} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-bold text-gray-600">{item.rating || '0.0'}</span>
                    </div>
                    <p className="text-sm font-black text-primary mt-2">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => handleRemove(e, item.id)}
                      className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-6 animate-pulse">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada produk favorit</h3>
            <p className="text-sm text-gray-400 mt-2 text-center max-w-[250px] leading-relaxed">
              Simpan produk yang kamu incar untuk dibeli nanti.
            </p>
            <Link href="/" className="mt-8 w-full max-w-[200px]">
              <Button className="w-full bg-primary text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
