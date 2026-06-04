
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
import { Smartphone, Gamepad2, CreditCard, Package, Truck, Tag, Zap, Wallet, QrCode } from 'lucide-react';
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
              {Banners.slice(0, 2).map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={cn(
                    "relative h-[170px] w-full rounded-[22px] bg-gradient-to-br p-5 text-white flex flex-col justify-center overflow-hidden transition-all duration-500",
                    banner.gradient
                  )}>
                    
                    {/* PREMIUM 3D VISUAL ILLUSTRATIONS */}
                    <div className="absolute right-0 top-0 bottom-0 w-[42%] flex items-center justify-center pointer-events-none select-none z-0">
                      {banner.type === 'digital' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          
                          {/* Subtle Background Glow */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>

                          {/* 3D Glassmorphism E-Wallet Card - Repositioned Right */}
                          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[135px] h-[82px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_25px_45px_rgba(0,0,0,0.3)] rotate-[15deg] p-3.5 flex flex-col justify-between overflow-hidden z-20 animate-float">
                             <div className="flex justify-between items-start">
                               {/* Card Chip Visual */}
                               <div className="w-8 h-6 rounded-md bg-gradient-to-br from-yellow-400/40 to-yellow-600/20 border border-yellow-400/30"></div>
                               <Wallet className="w-5 h-5 text-white/80 drop-shadow-md" />
                             </div>
                             <div className="space-y-2">
                               <div className="w-full h-1.5 bg-white/20 rounded-full"></div>
                               <div className="w-2/3 h-1.5 bg-white/10 rounded-full"></div>
                             </div>
                             {/* Highlight/Glow */}
                             <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-cyan-400/30 blur-3xl"></div>
                          </div>

                          {/* 3D Floating Satellite Icons - Repositioned */}
                          {/* 3D Game Controller - Top Right */}
                          <div className="absolute top-4 right-2 animate-float-reverse z-10">
                             <div className="bg-indigo-500/20 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-2xl">
                               <Gamepad2 className="w-6 h-6 text-white drop-shadow-md" />
                             </div>
                          </div>
                          
                          {/* 3D Lightning/Electricity - Bottom Right */}
                          <div className="absolute bottom-8 right-0 animate-float z-30">
                             <div className="bg-yellow-500/20 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-2xl">
                               <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/40 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                             </div>
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
            {Banners.slice(0, 2).map((_, index) => (
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
