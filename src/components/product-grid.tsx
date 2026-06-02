
"use client"

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, ArrowRight, Shirt, Sparkles, Truck } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatSold, getProductImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

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
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => { api.scrollNext(); }, 4000);
    return () => clearInterval(intervalId);
  }, [api]);

  const slides = [
    {
      id: 'fashion',
      badge: 'FASHION TREND',
      title: 'KOLEKSI FASHION PILIHAN',
      subtitle: 'Kaos Oversized • Kemeja Premium • Fashion Casual',
      path: '/kategori/fashion',
      icon: Shirt,
      gradient: 'from-[#004D2C] via-[#008F4C] to-[#00A859]',
      glow: 'bg-emerald-400/20'
    },
    {
      id: 'beauty',
      badge: 'BEAUTY TREND',
      title: 'KOLEKSI BEAUTY PILIHAN',
      subtitle: 'Skincare • Bodycare • Makeup',
      path: '/kategori/kecantikan',
      icon: Sparkles,
      gradient: 'from-[#6D28D9] via-[#DB2777] to-[#F43F5E]',
      glow: 'bg-rose-400/20'
    }
  ];

  return (
    <div className="rounded-[14px] overflow-hidden shadow-xl h-full min-h-[285px] relative">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full h-full">
        <CarouselContent className="h-full ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 h-full">
              <Link href={slide.path} className={cn("bg-gradient-to-br flex flex-col group relative active:scale-[0.98] transition-all h-full min-h-[285px] border-none text-white", slide.gradient)}>
                <div className="absolute -right-8 -bottom-8 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
                  <slide.icon className="w-44 h-44 rotate-12" />
                </div>
                <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none", slide.glow)} />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="p-4 flex-1 flex flex-col justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="inline-flex"><span className="bg-white/20 backdrop-blur-md border border-white/20 text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] leading-none">{slide.badge}</span></div>
                    <div className="space-y-1.5"><h3 className="text-[14px] font-black leading-tight tracking-tight uppercase">{slide.title}</h3><p className="text-[9px] text-white/80 font-medium leading-tight">{slide.subtitle}</p></div>
                  </div>
                  <div className="mt-auto pt-8 space-y-4">
                    <div className="flex flex-col"><p className="text-[8px] text-white/50 font-bold uppercase leading-none mb-1 tracking-widest">Mulai</p><p className="text-[16px] font-black text-white leading-none">Rp49.000</p></div>
                    <div className="bg-white text-gray-900 text-[9px] font-black px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-black/10 group-hover:bg-white/95 transition-all w-fit uppercase tracking-tighter">LIHAT KOLEKSI <ArrowRight className="w-3 h-3" /></div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
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
    e.preventDefault(); e.stopPropagation();
    const saved = localStorage.getItem('marpay_wishlist');
    let wishlist = saved ? JSON.parse(saved) : [];
    const isNowFavorited = !isFavorited;
    if (isNowFavorited) {
      wishlist.push({ ...product });
      toast({ variant: "default", title: "Favorit Tersimpan", description: "Produk berhasil disimpan", duration: 2000 });
    } else {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      toast({ variant: "default", title: "Favorit Dihapus", description: "Produk dihapus dari wishlist.", duration: 2000 });
    }
    localStorage.setItem('marpay_wishlist', JSON.stringify(wishlist));
    setIsFavorited(isNowFavorited);
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock) {
      toast({ variant: "destructive", title: "Stok Habis", description: "Maaf, stok produk ini sedang kosong.", duration: 2000 });
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
      category: product.category,
      shippingFee: product.shippingFee || 0
    };

    const savedCart = localStorage.getItem('marpay_cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cart.findIndex((item: any) => item.id === cartItem.id && item.variant === cartItem.variant);
    if (existingIndex > -1) cart[existingIndex].quantity += 1;
    else cart.push(cartItem);

    localStorage.setItem('marpay_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    toast({ variant: "default", title: "Masuk Keranjang", description: "Siap untuk checkout", duration: 2000 });
  };

  const hasShippingFee = (product.shippingFee || 0) > 0;

  return (
    <div className={cn("bg-white rounded-[14px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative", compact ? "min-w-[145px] w-[145px]" : "w-full", isOutOfStock && "opacity-75")}>
      <Link href={`/product/${product.id}`} className="relative aspect-square block">
        <Image src={displayImage} alt={product.name} fill className={cn("object-cover", isOutOfStock && "grayscale")} />
        {product.discount && !isOutOfStock && <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">{product.discount} OFF</div>}
        {isOutOfStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Stok Habis</span></div>}
        <button onClick={handleToggleFavorite} className={cn("absolute top-1.5 right-1.5 p-1.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm transition-all active:scale-150 duration-200", isFavorited ? "text-red-500" : "text-gray-400")}>
          <Heart className={cn("w-3.5 h-3.5", isFavorited && "fill-red-500")} />
        </button>
      </Link>
      <div className="p-2.5 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`} className="mb-1"><h3 className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight h-[26px]">{product.name}</h3></Link>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-bold text-red-600">Rp {product.price.toLocaleString()}</p>
            {/* REVISI: Hanya tampilkan info jika GRATIS ONGKIR */}
            {!hasShippingFee && product.type !== 'digital' && (
              <div className="flex items-center text-[8px] text-green-500 font-black uppercase gap-0.5">
                <Truck className="w-2.5 h-2.5" /> Gratis
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-hidden">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="text-[10px] font-bold text-gray-700">{product.rating || '0.0'}</span>
              <span className="text-[10px] text-gray-400 mx-0.5 flex-shrink-0">|</span>
              <span className="text-[10px] text-gray-500 truncate">{formatSold(product.sold || 0)}</span>
            </div>
            <button onClick={handleAddToCart} disabled={isOutOfStock} className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ml-1", isOutOfStock ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white")}><ShoppingBag className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
