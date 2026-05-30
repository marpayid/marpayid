"use client"

import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductGrid } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banners, Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopSearch />
      
      <main className="pt-16">
        {/* Hero Banner Slider */}
        <section className="px-4 pt-4">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[21/9] overflow-hidden rounded-[20px] bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 shadow-md">
                    <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[70%]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">MarPay</span>
                        <span className="bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Marketplace</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 leading-tight">{banner.title}</h3>
                      <p className="text-[10px] text-white/80 line-clamp-2">{banner.subtitle}</p>
                      
                      <div className="flex gap-2 mt-4 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                             <div className="w-4 h-4 rounded-sm border border-white/30" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Abstract Box Icon in background */}
                    <div className="absolute right-[-10%] bottom-[-10%] w-48 h-48 bg-white/10 rounded-3xl rotate-12 flex items-center justify-center">
                       <div className="w-32 h-32 border-4 border-white/20 rounded-2xl" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Slider Indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
             <div className="w-6 h-1 rounded-full bg-primary" />
             <div className="w-2 h-1 rounded-full bg-gray-200" />
          </div>
        </section>

        {/* Categories */}
        <CategoryMenu />

        {/* Flash Sale */}
        <FlashSale />

        {/* Rekomendasi Untukmu Section */}
        <section className="mt-8 px-4">
          <h2 className="text-md font-bold text-gray-900 mb-4">Rekomendasi Untukmu</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
            {Products.slice(0, 4).map((product) => (
              <div key={product.id} className="min-w-[160px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Link href={`/product/${product.id}`} className="relative aspect-square block">
                  <Image 
                    src={product.image || ''} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                      {product.discount} OFF
                    </div>
                  )}
                  <button className="absolute top-2 right-2 p-1.5 bg-black/5 rounded-full backdrop-blur-sm">
                    <Heart className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </Link>
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-8 mb-1">{product.name}</h3>
                  <p className="text-sm font-bold text-red-600">Rp {product.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-semibold text-gray-600">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground border-l pl-1"> {product.sold >= 1000 ? `${(product.sold/1000).toFixed(1)}rb` : product.sold} terjual</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Grid with Tabs */}
        <ProductGrid />
      </main>

      <BottomNav />
    </div>
  );
}