
"use client"

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatSold, getProductImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProductGrid() {
  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');
  
  return (
    <section className="mt-6 px-4 pb-24">
      <Tabs defaultValue="viral" className="w-full">
        <TabsList className="bg-transparent border-b border-gray-100 w-full flex justify-start h-auto p-0 mb-4 gap-6 overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="viral" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-base px-0 pb-2 shadow-none transition-none"
          >
            Produk Viral
          </TabsTrigger>
          <TabsTrigger 
            value="semua" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-base px-0 pb-2 shadow-none transition-none"
          >
            Semua Produk
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="viral">
          <div className="grid grid-cols-2 gap-3">
            {viralProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="semua">
          <div className="grid grid-cols-2 gap-3">
            {Products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function FashionDiscoveryCard() {
  return (
    <Link 
      href="/kategori/fashion" 
      className="bg-white rounded-[14px] border border-gray-100 overflow-hidden shadow-md flex flex-col group relative active:scale-[0.98] transition-all h-full"
    >
      {/* Visual Area - Taller aspect ratio (4:4.5) to make it ~15-20% taller than normal cards */}
      <div className="relative aspect-[4/4.5] bg-[#F9FAFB] flex items-center justify-center p-0 overflow-hidden">
        <Image 
          src="https://picsum.photos/seed/fashion-3d-premium-v3/600/600" 
          alt="Premium Fashion Discovery" 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="3D fashion"
        />
        
        {/* Premium Background Visual Elements (Family Style with Game & Wallet Cards) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Soft Blue-Purple Glow Accents */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Subtle Glass Overlay for 3D depth */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[7px] text-white font-black uppercase tracking-widest">Eksklusif</span>
        </div>
      </div>
      
      <div className="p-3.5 flex-1 flex flex-col justify-center gap-1.5">
        <div className="inline-flex">
          <span className="bg-[#E6F6EF] text-[#00A859] text-[8px] font-black px-2.5 py-1 rounded uppercase tracking-[0.05em] border border-[#D1F0E0]">
            FASHION TREND
          </span>
        </div>
        <h3 className="text-[12px] font-bold text-gray-900 leading-tight">
          Koleksi Fashion Pilihan
        </h3>
        <p className="text-[9px] text-gray-400 font-medium leading-tight line-clamp-2">
          Kaos Oversized, Kemeja Premium dan Fashion Casual
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[8px] text-gray-400 font-bold uppercase leading-none mb-0.5">Mulai</p>
            <p className="text-[14px] font-black text-primary leading-none">Rp49.000</p>
          </div>
          <div className="bg-primary text-white text-[9px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/15 group-hover:bg-primary/90 transition-colors">
            Cek <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product, compact = false }: { product: any, compact?: boolean }) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const isOutOfStock = product.stock === 'Stok Habis';
  const displayImage = getProductImage(product);

  useEffect(() => {
    const checkFavorite = () => {
      const saved = localStorage.getItem('marpay_wishlist');
      if (saved) {
        const wishlist = JSON.parse(saved);
        setIsFavorited(wishlist.some((item: any) => item.id === product.id));
      }
    };
    checkFavorite();
    window.addEventListener('wishlist-updated', checkFavorite);
    return () => window.removeEventListener('wishlist-updated', checkFavorite);
  }, [product.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem('marpay_wishlist');
    let wishlist = saved ? JSON.parse(saved) : [];
    
    const isNowFavorited = !isFavorited;
    
    if (isNowFavorited) {
      wishlist.push({ ...product, price: product.price });
      toast({
        variant: "default",
        title: "Favorit Tersimpan",
        description: "Produk berhasil disimpan",
        duration: 2000,
      });
    } else {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      toast({
        variant: "default",
        title: "Favorit Dihapus",
        description: "Produk dihapus dari wishlist.",
        duration: 2000,
      });
    }

    localStorage.setItem('marpay_wishlist', JSON.stringify(wishlist));
    setIsFavorited(isNowFavorited);
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast({
        variant: "destructive",
        title: "Stok Habis",
        description: "Maaf, stok produk ini sedang kosong.",
        duration: 2000,
      });
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      variant: product.variants?.[0] || 'Default',
      quantity: 1,
      type: product.type || 'physical',
      category: product.category
    };

    const savedCart = localStorage.getItem('marpay_cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex((item: any) => item.id === cartItem.id && item.variant === cartItem.variant);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('marpay_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    toast({
      variant: "default",
      title: "Masuk Keranjang",
      description: "Siap untuk checkout",
      duration: 2000,
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-[14px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative",
      compact ? "min-w-[145px] w-[145px]" : "w-full",
      isOutOfStock && "opacity-75"
    )}>
      <Link href={`/product/${product.id}`} className="relative aspect-square block">
        <Image 
          src={displayImage} 
          alt={product.name} 
          fill 
          className={cn("object-cover", isOutOfStock && "grayscale")}
        />
        {product.discount && !isOutOfStock && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
            {product.discount} OFF
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Stok Habis</span>
          </div>
        )}
        <button 
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-1.5 right-1.5 p-1.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm transition-all active:scale-150 duration-200",
            isFavorited ? "text-red-500" : "text-gray-400"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", isFavorited && "fill-red-500")} />
        </button>
      </Link>
      <div className="p-2.5 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`} className="mb-1">
          <h3 className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight h-[26px]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto">
          <p className="text-sm font-bold text-red-600 mb-1.5">Rp {product.price.toLocaleString()}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-hidden">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="text-[10px] font-bold text-gray-700">{product.rating || '0.0'}</span>
              <span className="text-[10px] text-gray-400 mx-0.5 flex-shrink-0">|</span>
              <span className="text-[10px] text-gray-500 truncate">{formatSold(product.sold || 0)}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ml-1",
                isOutOfStock 
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                  : "border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white"
              )}
            >
              <ShoppingBag className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
