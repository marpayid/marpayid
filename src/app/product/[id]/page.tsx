
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Share2, ShoppingBag, Heart, Star, ShieldCheck, 
  Truck, ChevronRight, Minus, Plus, MessageCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatSold } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const product = useMemo(() => Products.find(p => p.id === Number(id)), [id]);
  const isOutOfStock = product?.stock === 'Stok Habis';

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (product.id === 2) {
      return selectedVariant === 1 ? 309000 : 269000;
    }
    return product.price;
  }, [product, selectedVariant]);

  if (!product) return <div className="p-8 text-center font-bold">Produk tidak ditemukan</div>;

  const variants = product.variants || ['Default'];
  const totalPrice = currentPrice * quantity;
  const hasDiscount = !!product.originalPrice;

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (isOutOfStock) return;
    if (type === 'inc') setQuantity(prev => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAction = (redirect = false) => {
    if (isOutOfStock) {
      toast({
        variant: "destructive",
        title: "Stok Habis",
        description: "Maaf, produk ini sedang tidak tersedia.",
      });
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      variant: variants[selectedVariant],
      quantity: quantity,
      type: product.type || 'physical'
    };

    if (redirect) {
      localStorage.setItem('marpay_checkout_temp', JSON.stringify([item]));
      router.push('/checkout');
    } else {
      const savedCart = localStorage.getItem('marpay_cart');
      let cart = savedCart ? JSON.parse(savedCart) : [];

      const existingIndex = cart.findIndex((i: any) => i.id === item.id && i.variant === item.variant);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push(item);
      }

      localStorage.setItem('marpay_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));

      toast({
        variant: "success",
        title: "Berhasil Ditambahkan",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </Button>
          <span className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{product.name}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="w-5 h-5 text-gray-800" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <ShoppingBag className="w-5 h-5 text-gray-800" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-14">
        <div className="px-4 py-3 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate">{product.name}</span>
        </div>

        <section className="bg-white">
          <div className="relative aspect-square w-full">
            <Image 
              src={product.image || ''} 
              alt={product.name} 
              fill 
              className={cn("object-cover", isOutOfStock && "grayscale")}
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-[0.2em] shadow-2xl">
                  Stok Habis
                </div>
              </div>
            )}
          </div>
        </section>

        {product.type !== 'digital' && !isOutOfStock && (
          <section className="mx-4 my-2 bg-white border border-[#22c55e]/15 rounded-[10px] px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3 h-[60px]">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-blue-500 uppercase tracking-tight mb-0">GRATIS ONGKIR</p>
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">Potongan Maksimal Rp20.000</p>
            </div>
          </section>
        )}

        <section className="mt-2 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0">
              {product.category}
            </Badge>
            {product.tag && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0">
                {product.tag}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold px-2 py-0">
                Stok Habis
              </Badge>
            )}
          </div>
          <h1 className="text-md font-medium text-gray-800 mb-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{product.rating || '0.0'}</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <span className="text-xs text-gray-500">{product.reviews || '0'} Ulasan</span>
            <div className="h-3 w-px bg-gray-200" />
            <span className="text-xs text-gray-500">{formatSold(product.sold || 0)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-primary font-headline">Rp {currentPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through mb-1">Rp {product.originalPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-3">Pilih Varian</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, idx) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(idx)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                    selectedVariant === idx 
                      ? "bg-primary/5 border-primary text-primary shadow-sm" 
                      : "bg-white border-gray-100 text-gray-600"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-800">Atur Jumlah</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Stok: {isOutOfStock ? '0' : (product.stock || 120)}</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary" 
                onClick={() => handleQuantity('dec')}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary" 
                onClick={() => handleQuantity('inc')}
                disabled={isOutOfStock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white p-4">
          <h3 className="text-sm font-bold mb-3">Deskripsi Produk</h3>
          <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">
            {product.description}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col mr-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Harga</p>
          <p className="text-lg font-bold text-primary leading-none">Rp {totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex gap-2 flex-1">
          <Button 
            variant="outline" 
            disabled={isOutOfStock}
            className={cn(
              "flex-1 border-primary text-primary font-bold h-11 rounded-xl active:scale-95 transition-transform text-xs",
              isOutOfStock && "opacity-50 grayscale cursor-not-allowed"
            )}
            onClick={() => handleAction(false)}
          >
            + Keranjang
          </Button>
          <Button 
            disabled={isOutOfStock}
            className={cn(
              "flex-1 bg-primary text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform text-xs",
              isOutOfStock && "bg-gray-400 shadow-none cursor-not-allowed"
            )}
            onClick={() => handleAction(true)}
          >
            {isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}
          </Button>
        </div>
      </div>
    </div>
  );
}
