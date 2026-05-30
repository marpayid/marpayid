"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProductGrid() {
  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');
  const allProducts = Products;

  return (
    <section className="mt-6 px-4 pb-24">
      <Tabs defaultValue="viral" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="viral" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary font-bold text-xs">Produk Viral</TabsTrigger>
          <TabsTrigger value="semua" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary font-bold text-xs">Semua Produk</TabsTrigger>
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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      <Link href={`/product/${product.id}`} className="relative aspect-square">
        <Image 
          src={product.image || ''} 
          alt={product.name} 
          fill 
          className="object-cover"
          data-ai-hint="digital product card"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            {product.discount}
          </div>
        )}
      </Link>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug h-8 mb-1">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-gray-600">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground border-l pl-1">Terjual {product.sold >= 1000 ? `${(product.sold/1000).toFixed(1)}rb+` : product.sold}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-sm font-bold text-red-600">Rp {product.price.toLocaleString()}</p>
          <Button size="icon" className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}