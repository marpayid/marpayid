"use client"

import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductGrid } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banners } from '@/app/lib/dummy-data';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <TopSearch />
      
      <main className="pt-16">
        <div className="px-4 pt-4">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-md">
                    <Image 
                      src={banner.image || ''} 
                      alt={banner.title} 
                      fill 
                      className="object-cover"
                      priority
                      data-ai-hint="promotional banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-sm font-bold text-white mb-0.5">{banner.title}</h3>
                      <p className="text-[10px] text-white/80">Penawaran khusus untukmu</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <CategoryMenu />
        <FlashSale />
        <ProductGrid />
      </main>

      <BottomNav />
    </div>
  );
}