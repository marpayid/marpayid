"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProductGrid() {
  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');
  const allProducts = Products;

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
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function ProductCard({ product, compact = false }: { product: any, compact?: boolean }) {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: product.variants?.[0] || 'Default',
      quantity: 1
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
      title: "✅ Berhasil ditambahkan ke keranjang",
      description: product.name,
      duration: 2000,
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-[14px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative",
      compact ? "min-w-[145px] w-[145px]" : "w-full"
    )}>
      <Link href={`/product/${product.id}`} className="relative aspect-square block">
        <Image 
          src={product.image || ''} 
          alt={product.name} 
          fill 
          className="object-cover"
        />
        {product.discount && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
            {product.discount} OFF
          </div>
        )}
        <button className="absolute top-1.5 right-1.5 p-1.5 bg-white/80 rounded-full shadow-sm text-gray-400 active:text-red-500 backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5" />
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
              <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400 mx-0.5 flex-shrink-0">|</span>
              <span className="text-[10px] text-gray-500 truncate">{product.sold} terjual</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-6 h-6 rounded-full border border-primary/20 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0 ml-1"
            >
              <ShoppingCart className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
