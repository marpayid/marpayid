"use client"

import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductGrid, ProductCard } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banners, Products } from '@/app/lib/dummy-data';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopSearch />
      
      <main className="pt-16 space-y-2">
        {/* 1. Hero Banner Slider */}
        <section className="px-4 pt-3 bg-white">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={`relative h-[155px] w-full overflow-hidden rounded-[22px] bg-gradient-to-br ${banner.gradient} shadow-md border border-white/10`}>
                    {/* Visual Decor Elements (3D Simulated) */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute right-4 bottom-4 w-24 h-24 bg-cyan-300 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[75%] z-10">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {banner.badges.map((badge, idx) => (
                          <span 
                            key={idx} 
                            className="bg-white/20 backdrop-blur-md text-white text-[7px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1.5 leading-tight drop-shadow-sm">
                        {banner.title}
                      </h3>
                      
                      <p className="text-[9px] text-white/90 font-medium leading-tight max-w-[180px]">
                        {banner.subtitle}
                      </p>
                    </div>

                    {/* Abstract 3D Shapes */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 w-16 h-16">
                       {banner.type === 'digital' ? (
                         <div className="relative w-full h-full">
                           <div className="absolute inset-0 bg-white/10 rounded-2xl rotate-12 backdrop-blur-sm border border-white/20"></div>
                           <div className="absolute inset-2 bg-white/20 rounded-2xl -rotate-6 backdrop-blur-sm"></div>
                           <div className="absolute inset-0 flex items-center justify-center text-white/40 font-black text-xl">3D</div>
                         </div>
                       ) : (
                         <div className="relative w-full h-full">
                           <div className="absolute inset-0 bg-white/10 rounded-full scale-110 blur-sm"></div>
                           <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-lg rotate-45 border border-white/20"></div>
                           <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                         </div>
                       )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Slider Indicator */}
          <div className="flex justify-center gap-1 mt-3 pb-1">
             <div className="w-4 h-1 rounded-full bg-primary" />
             <div className="w-1 h-1 rounded-full bg-gray-200" />
          </div>
        </section>

        {/* 2. Category Scroll Menu */}
        <CategoryMenu />

        {/* 3. Flash Sale */}
        <FlashSale />

        {/* 4. Rekomendasi Untukmu Section */}
        <section className="bg-white py-4 px-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Rekomendasi Untukmu</h2>
          <div className="grid grid-cols-2 gap-3">
            {Products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
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
