
"use client"

import { useState, useEffect } from 'react';
import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductCard, FashionDiscoveryCard } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Banners, Products } from '@/app/lib/dummy-data';
import { cn } from '@/lib/utils';
import { Smartphone, Gamepad2, CreditCard, Package, Truck, Tag } from 'lucide-react';
import { PromotionalCards } from '@/components/promotional-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopSearch />
      
      <main className="pt-16 space-y-2">
        {/* 1. Banner Utama */}
        <section className="px-4 pt-3 bg-white">
          <Carousel 
            className="w-full" 
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={`relative h-[170px] w-full overflow-hidden rounded-[22px] bg-gradient-to-br ${banner.gradient} shadow-md border border-white/10 group`}>
                    
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                      <div className="absolute right-10 bottom-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
                    </div>

                    <div className="absolute inset-0 p-5 pb-6 flex flex-col justify-center max-w-[70%] z-20">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {banner.badges.map((badge, idx) => (
                          <span 
                            key={idx} 
                            className="bg-white/20 backdrop-blur-md text-white text-[7px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20 whitespace-nowrap"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-base font-bold text-white mb-1.5 leading-tight drop-shadow-md">
                        {banner.title}
                      </h3>
                      
                      <p className="text-[9px] text-white/80 font-medium leading-tight">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 z-10 flex items-center justify-center">
                       {banner.type === 'digital' ? (
                         <div className="relative w-full h-full scale-110">
                           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-24 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 rotate-12 shadow-2xl overflow-hidden animate-float">
                             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/20 rounded-full"></div>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-400/30 rounded-full blur-sm"></div>
                           </div>
                           <div className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 animate-float-reverse">
                             <CreditCard className="w-5 h-5 text-cyan-300" />
                           </div>
                           <div className="absolute bottom-4 left-2 p-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 animate-float-slow">
                             <Gamepad2 className="w-5 h-5 text-indigo-200" />
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-xl rounded-full border border-white/40 shadow-xl animate-pulse">
                             <Smartphone className="w-6 h-6 text-white" />
                           </div>
                         </div>
                       ) : (
                         <div className="relative w-full h-full scale-110">
                           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-xl border border-white/30 rotate-12 shadow-2xl flex items-center justify-center animate-float">
                             <Package className="w-10 h-10 text-white/50" />
                           </div>
                           <div className="absolute -top-1 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-lg animate-float-reverse">
                             <Truck className="w-6 h-6 text-emerald-300" />
                           </div>
                           <div className="absolute bottom-1 left-2 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-lg animate-float-slow">
                             <Tag className="w-6 h-6 text-white" />
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500/40 rounded-full blur-xl animate-pulse"></div>
                         </div>
                       )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          <div className="flex justify-center gap-1.5 mt-3 pb-1">
             {Banners.map((_, index) => (
               <div 
                 key={index} 
                 className={cn(
                   "transition-all duration-300 rounded-full",
                   current === index ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-200"
                 )} 
               />
             ))}
          </div>
        </section>

        {/* 2. Kategori */}
        <CategoryMenu />

        {/* 3. Flash Sale */}
        <FlashSale />

        {/* 4. Produk Viral (with Tabs) */}
        <section className="bg-white py-4 px-4">
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

        {/* 5. Rekomendasi Untukmu & Fashion Discovery Card */}
        <section className="bg-white py-4 px-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Rekomendasi Untukmu</h2>
          <div className="grid grid-cols-2 gap-3">
            {Products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {/* Native Fashion Discovery Card */}
            <FashionDiscoveryCard />
          </div>
        </section>

        {/* 6. Promotional Cards */}
        <PromotionalCards />

        {/* 7. Semua Produk */}
        <section className="bg-white px-4 pb-24">
          <h2 className="text-base font-bold text-gray-900 mb-3 pt-4 border-t border-gray-100">Semua Produk</h2>
          <div className="grid grid-cols-2 gap-3">
            {Products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
