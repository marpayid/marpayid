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
import { Smartphone, Gamepad2, CreditCard, Package, Truck, Tag, Zap, Wallet } from 'lucide-react';
import { PromotionalCards } from '@/components/promotional-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoucherSection } from '@/components/voucher-section';

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    const intervalId = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(intervalId);
  }, [api]);

  const viralProducts = Products.filter(p => p.tag === 'Produk Viral');
  
  // Rekomendasi: Wispie (ID: 3) harus pertama, Akrilik (ID: 2) dihapus dari Recs
  const wispie = Products.find(p => p.id === 3);
  const otherRecs = Products.filter(p => p.id !== 3 && p.id !== 2 && p.id !== 6);
  const recommendationList = wispie ? [wispie, ...otherRecs] : otherRecs;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopSearch />
      <main className="pt-16 space-y-2">
        {/* Banner Section with Indicators */}
        <section className="px-4 pt-3 bg-white relative">
          <Carousel opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={cn(
                    "relative h-[170px] w-full rounded-[22px] bg-gradient-to-br p-5 text-white flex flex-col justify-center overflow-hidden transition-all duration-500",
                    banner.gradient
                  )}>
                    
                    {/* PREMIUM 3D VISUAL ILLUSTRATIONS */}
                    <div className="absolute right-0 top-0 bottom-0 w-[40%] flex items-center justify-center pointer-events-none select-none z-0">
                      {banner.type === 'digital' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* 3D Smartphone Dark Premium */}
                          <div className="relative w-20 h-40 bg-neutral-950 rounded-[28px] border-[3px] border-neutral-800 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] rotate-[-12deg] flex items-center justify-center overflow-hidden animate-float">
                             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10"></div>
                             {/* Phone Details */}
                             <div className="w-1 h-1 rounded-full bg-neutral-800 absolute top-2"></div>
                             <div className="grid grid-cols-2 gap-1.5 p-3 w-full">
                               {[1,2,3,4].map(i => (
                                 <div key={i} className="aspect-square rounded-md bg-white/5 border border-white/5"></div>
                               ))}
                             </div>
                          </div>

                          {/* Glassmorphism E-Wallet Card */}
                          <div className="absolute top-1/2 left-[-15px] -translate-y-1/2 w-32 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] rotate-[15deg] p-3 flex flex-col justify-between overflow-hidden z-10 animate-float-slow">
                             <div className="flex justify-between items-start">
                               <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/30 to-transparent backdrop-blur-md"></div>
                               <Wallet className="w-4 h-4 text-white/60" />
                             </div>
                             <div className="space-y-1.5">
                               <div className="w-full h-1 bg-white/20 rounded-full"></div>
                               <div className="w-2/3 h-1 bg-white/10 rounded-full"></div>
                             </div>
                             {/* Glow effect */}
                             <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-cyan-400/30 blur-2xl"></div>
                          </div>

                          {/* Small Floating Icons */}
                          <div className="absolute top-4 right-8 animate-float-reverse opacity-40">
                             <Gamepad2 className="w-7 h-7 text-white" />
                          </div>
                          <div className="absolute bottom-8 right-2 animate-float opacity-40">
                             <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* 3D Package Look */}
                          <div className="relative w-28 h-28 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center animate-float">
                             <Package className="w-14 h-14 text-white/30" />
                             {/* Glass Tag */}
                             <div className="absolute -top-4 -right-2 w-16 h-10 bg-orange-500/80 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg rotate-12 flex items-center justify-center">
                               <Tag className="w-5 h-5 text-white" />
                             </div>
                          </div>
                          
                          {/* Shipping Visual */}
                          <div className="absolute -bottom-2 right-4 w-32 h-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 rotate-[-5deg] flex items-center px-4 gap-3">
                             <Truck className="w-6 h-6 text-white/40" />
                             <div className="space-y-1.5 flex-1">
                               <div className="w-full h-1 bg-white/20 rounded-full"></div>
                               <div className="w-1/2 h-1 bg-white/10 rounded-full"></div>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[70%] space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {banner.badges?.map((badge, idx) => (
                          <span key={idx} className="bg-white/20 backdrop-blur-md border border-white/10 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[17px] font-black leading-[1.1] tracking-tight whitespace-pre-line">
                          {banner.title.split(' ').reduce((acc, word, i) => {
                            // Sederhanakan judul agar tidak menutupi visual 3D
                            return i % 3 === 2 ? acc + word + '\n' : acc + word + ' ';
                          }, '')}
                        </h3>
                        <p className="text-[9px] opacity-80 leading-relaxed font-medium line-clamp-2">{banner.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Slider Indicators (Dots) */}
          <div className="flex justify-center gap-1.5 mt-3 pb-2">
            {Banners.map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full",
                  current === index ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
                )}
              />
            ))}
          </div>
        </section>

        <CategoryMenu />
        <FlashSale />
        <VoucherSection />

        <section className="bg-white py-4 px-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Rekomendasi Untukmu</h2>
          <div className="grid grid-cols-2 gap-3">
            {recommendationList.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            <FashionDiscoveryCard />
            {recommendationList.slice(4, 6).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <PromotionalCards />

        <section className="bg-white py-4 px-4 pb-24">
          <Tabs defaultValue="viral">
            <TabsList className="bg-transparent border-b border-gray-100 w-full flex justify-start mb-4 gap-6">
              <TabsTrigger value="viral" className="font-bold text-base px-0">Produk Viral</TabsTrigger>
              <TabsTrigger value="semua" className="font-bold text-base px-0">Semua Produk</TabsTrigger>
            </TabsList>
            <TabsContent value="viral">
              <div className="grid grid-cols-2 gap-3">
                {viralProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>
            <TabsContent value="semua">
              <div className="grid grid-cols-2 gap-3">
                {Products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
