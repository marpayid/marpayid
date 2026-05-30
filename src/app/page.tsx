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
    <div className="min-h-screen bg-background pb-10">
      <TopSearch />
      
      <main className="pt-16">
        <div className="px-0 pt-2">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[2/1] overflow-hidden rounded-none">
                    <Image 
                      src={banner.image || ''} 
                      alt={banner.title} 
                      fill 
                      className="object-cover"
                      priority
                      data-ai-hint="promotional banner"
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/20 backdrop-blur-sm rounded-xl text-white">
                      <h3 className="text-lg font-bold font-headline">{banner.title}</h3>
                      <p className="text-xs opacity-90">Special promotion for you</p>
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