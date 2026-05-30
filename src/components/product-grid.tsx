"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProductGrid() {
  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');
  const allProducts = Products;

  return (
    <section className="mt-6 px-4 pb-24">
      <Tabs defaultValue="viral" className="w-full">
        <TabsList className="bg-transparent border-b border-gray-100 w-full flex justify-start h-auto p-0 mb-4 gap-6 overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="viral" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-xs px-0 pb-2 shadow-none"
          >
            Produk Viral
          </TabsTrigger>
          <TabsTrigger 
            value="semua" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-xs px-0 pb-2 shadow-none"
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

function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative">
      <Link href={`/product/${product.id}`} className="relative aspect-square">
        <Image 
          src={product.image || ''} 
          alt={product.name} 
          fill 
          className="object-cover"
        />
        {product.discount && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
            {product.discount}
          </div>
        )}
        <button className="absolute top-1.5 right-1.5 p-1 bg-white/80 rounded-full shadow-sm text-gray-400 active:text-red-500 backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5" />
        </button>
      </Link>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight h-7 mb-1">{product.name}</h3>
          </Link>
          <p className="text-sm font-bold text-red-600 mb-2">Rp {product.price.toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[9px] font-semibold text-gray-600">{product.rating}</span>
            <span className="text-[9px] text-muted-foreground border-l pl-1 ml-0.5"> {product.sold >= 1000 ? `${(product.sold/1000).toFixed(1)}rb` : product.sold} terjual</span>
          </div>
          <button className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
