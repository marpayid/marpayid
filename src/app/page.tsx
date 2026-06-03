
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
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    const intervalId = setInterval(() => api.scrollNext(), 4000);
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
        <section className="px-4 pt-3 bg-white">
          <Carousel opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {Banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={`relative h-[170px] w-full rounded-[22px] bg-gradient-to-br ${banner.gradient} p-5 text-white flex flex-col justify-center overflow-hidden`}>
                    <div className="relative z-10 max-w-[70%]">
                      <h3 className="text-base font-bold mb-1.5 leading-tight">{banner.title}</h3>
                      <p className="text-[9px] opacity-80">{banner.subtitle}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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
