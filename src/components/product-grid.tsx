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
  
  // Menambahkan Fashion Discovery Card di index 4 pada tab "Semua Produk"
  const allProductsWithAd = useMemo(() => {
    const list = [...Products];
    if (list.length >= 4) {
      list.splice(4, 0, { isDiscoveryCard: true } as any);
    }
    return list;
  }, []);

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
            {allProductsWithAd.map((item, idx) => (
              item.isDiscoveryCard ? (
                <FashionDiscoveryCard key="discovery-card" />
              ) : (
                <ProductCard key={item.id || idx} product={item} />
              )
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function FashionDiscoveryCard() {
  const fashionThumbs = Products.filter(p => 
    ['Benidson Oversized Tshirt Benstylish', 
     'Wispie Money Magnet Fitted Shirt', 
     'Rephatious T-shirt "Rpts412"'].includes(p.name)
  ).slice(0, 3);

  return (
    <Link 
      href="/kategori/fashion" 
      className="bg-white rounded-[14px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative active:scale-[0.98] transition-all"
    >
      <div className="relative aspect-square bg-[#F8FAFC] p-2 grid grid-cols-2 grid-rows-2 gap-1.5">
        <div className="relative row-span-2 rounded-lg overflow-hidden border border-white shadow-sm">
          <Image src={getProductImage(fashionThumbs[0])} alt="" fill className="object-cover" />
        </div>
        <div className="relative rounded-lg overflow-hidden border border-white shadow-sm">
          <Image src={getProductImage(fashionThumbs[1])} alt="" fill className="object-cover" />
        </div>
        <div className="relative rounded-lg overflow-hidden border border-white shadow-sm">
          <Image src={getProductImage(fashionThumbs[2])} alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      
      <div className="p-2.5 flex-1 flex flex-col justify-center">
        <div className="inline-flex mb-1.5">
          <span className="bg-[#E6F6EF] text-[#00A859] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-[#D1F0E0]">
            FASHION TREND
          </span>
        </div>
        <h3 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">
          Koleksi Fashion Pilihan
        </h3>
        <p className="text-[9px] text-gray-400 font-medium leading-tight line-clamp-1 mb-2">
          Kaos & Kemeja Premium
        </p>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-[11px] font-bold text-primary">Mulai <span className="text-xs">Rp49rb</span></p>
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
            <ArrowRight className="w-3 h-3" />
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
