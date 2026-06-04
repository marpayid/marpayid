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
                    {/* Background Visual Icons */}
                    {banner.type === 'digital' ? (
                      <>
                        <CreditCard className="absolute -right-4 top-4 w-24 h-24 text-white/10 -rotate-12 animate-float" />
                        <Smartphone className="absolute right-12 bottom-0 w-20 h-20 text-white/5 rotate-12 animate-float-slow" />
                        <Gamepad2 className="absolute -right-2 -bottom-4 w-28 h-28 text-white/10 -rotate-6 animate-float-reverse" />
                      </>
                    ) : (
                      <>
                        <Package className="absolute -right-4 top-4 w-24 h-24 text-white/10 -rotate-12 animate-float" />
                        <Tag className="absolute right-12 bottom-0 w-20 h-20 text-white/5 rotate-12 animate-float-slow" />
                        <Truck className="absolute -right-2 -bottom-4 w-28 h-28 text-white/10 -rotate-6 animate-float-reverse" />
                      </>
                    )}

                    {/* Content */}
                    <div className="relative z-10 max-w-[75%] space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {banner.badges?.map((badge, idx) => (
                          <span key={idx} className="bg-white/20 backdrop-blur-md border border-white/10 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[17px] font-black leading-[1.1] tracking-tight">{banner.title}</h3>
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
