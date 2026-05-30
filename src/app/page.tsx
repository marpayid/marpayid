"use client"

import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductGrid } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banners, Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopSearch />
      
      <main className="pt-16 space-y-2">
        {/* 1. Hero Banner Slider */}
        <section className="px-4 pt-4 bg-white">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 shadow-sm">
                    <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[70%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[8px] font-bold text-white tracking-widest uppercase">MarPay</span>
                        <span className="bg-white/20 text-white text-[7px] px-1 py-0.5 rounded font-bold uppercase tracking-tighter">Official</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 leading-tight">{banner.title}</h3>
                      <p className="text-[9px] text-white/80 line-clamp-1">{banner.subtitle}</p>
                    </div>
                    {/* Abstract Decor */}
                    <div className="absolute right-[-5%] bottom-[-10%] w-32 h-32 bg-white/10 rounded-full blur-xl" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Slider Indicator */}
          <div className="flex justify-center gap-1 mt-3 pb-3">
             <div className="w-4 h-1 rounded-full bg-primary" />
             <div className="w-1.5 h-1 rounded-full bg-gray-200" />
             <div className="w-1.5 h-1 rounded-full bg-gray-200" />
          </div>
        </section>

        {/* 2. Category Scroll Menu */}
        <CategoryMenu />

        {/* 3. Flash Sale */}
        <FlashSale />

        {/* 4. Rekomendasi Untukmu Section */}
        <section className="bg-white py-4 px-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Rekomendasi Untukmu</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {Products.slice(0, 5).map((product) => (
              <div key={product.id} className="min-w-[150px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                <Link href={`/product/${product.id}`} className="relative aspect-square block">
                  <Image 
                    src={product.image || ''} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                      {product.discount}
                    </div>
                  )}
                </Link>
                <div className="p-2.5">
                  <h3 className="text-[10px] font-medium text-gray-800 line-clamp-2 h-7 mb-1 leading-tight">{product.name}</h3>
                  <p className="text-xs font-bold text-red-600">Rp {product.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[9px] font-semibold text-gray-600">{product.rating}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingCart className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Product Tabs & Grid */}
        <div className="bg-white">
          <ProductGrid />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
