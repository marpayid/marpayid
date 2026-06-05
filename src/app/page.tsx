
"use client"

import { useState, useEffect, useMemo } from 'react';
import { TopSearch } from '@/components/top-search';
import { BottomNav } from '@/components/bottom-nav';
import { CategoryMenu } from '@/components/category-menu';
import { FlashSale } from '@/components/flash-sale';
import { ProductCard, FashionDiscoveryCard } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Banners, Products } from '@/app/lib/dummy-data';
import { cn } from '@/lib/utils';
import { 
  Smartphone, Gamepad2, CreditCard, Package, Truck, 
  Tag, Zap, Wallet, QrCode, ShoppingBag as ShoppingBagIcon,
  Flame, Sparkles, ChevronRight, CheckCircle2, Ticket
} from 'lucide-react';
import { PromotionalCards } from '@/components/promotional-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoucherSection } from '@/components/voucher-section';
import { PromoPopup } from '@/components/promo-popup';

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

  const viralProducts = useMemo(() => 
    Products.filter(p => p.tag === 'Produk Viral' && p.category !== 'Premium'), 
  []);
  
  const recommendationList = useMemo(() => {
    const priorityIds = [208, 207, 206, 205, 3, 1, 6, 201, 204, 203];
    const priorityItems = priorityIds
      .map(id => Products.find(p => p.id === id))
      .filter(p => p && p.category !== 'Premium') as typeof Products;

    const others = Products.filter(p => 
      !priorityIds.includes(p.id) && 
      p.id !== 2 && 
      p.category !== 'Premium'
    );
    
    return [...priorityItems, ...others];
  }, []);

  return (
    <div className="bg-gray-50 pb-32">
      <TopSearch />
      <PromoPopup />
      <main className="pt-16 space-y-1">
        <section className="px-4 pt-3 bg-white relative">
          <Carousel opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {Banners.slice(0, 2).map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={cn(
                    "relative h-44 w-full rounded-[22px] bg-gradient-to-br p-5 text-white flex flex-col justify-center overflow-hidden transition-all duration-500",
                    banner.gradient
                  )}>
                    <div className="absolute right-0 top-0 bottom-0 w-[42%] flex items-center justify-center pointer-events-none select-none z-0">
                      {banner.type === 'digital' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>
                          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[135px] h-[82px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_25px_45px_rgba(0,0,0,0.2)] rotate-[15deg] p-3.5 flex flex-col justify-between overflow-hidden z-20 animate-float">
                             <div className="flex justify-between items-start">
                               <div className="w-8 h-6 rounded-md bg-gradient-to-br from-yellow-400/40 to-yellow-600/20 border border-yellow-400/30"></div>
                               <Wallet className="w-5 h-5 text-white/80 drop-shadow-md" />
                             </div>
                             <div className="space-y-2">
                               <div className="w-full h-1.5 bg-white/20 rounded-full"></div>
                               <div className="w-2/3 h-1.5 bg-white/10 rounded-full"></div>
                             </div>
                             <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-cyan-400/30 blur-3xl"></div>
                          </div>
                          <div className="absolute top-4 right-2 animate-float-reverse z-10">
                             <div className="bg-indigo-500/20 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-2xl">
                               <Gamepad2 className="w-6 h-6 text-white drop-shadow-md" />
                             </div>
                          </div>
                          <div className="absolute bottom-8 right-0 animate-float z-30">
                             <div className="bg-yellow-500/20 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-2xl">
                               <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/40 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                             </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-[40px] rounded-full"></div>
                          <div className="absolute top-1/2 right-6 -translate-y-1/2 w-[95px] h-[115px] bg-white/15 backdrop-blur-2xl border border-white/30 rounded-[24px] shadow-[0_20px_45px_rgba(0,0,0,0.2)] rotate-[-8deg] flex flex-col items-center justify-center z-20 animate-float">
                             <div className="absolute -top-4 w-10 h-8 border-[3px] border-white/25 rounded-t-full"></div>
                             <ShoppingBagIcon className="w-10 h-10 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
                             <div className="mt-3 w-8 h-1 bg-white/20 rounded-full"></div>
                          </div>
                          <div className="absolute bottom-4 right-0 w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl rotate-[12deg] flex items-center justify-center z-30 animate-float-reverse">
                             <Package className="w-8 h-8 text-white/80 drop-shadow-md" />
                          </div>
                          <div className="absolute top-6 right-2 w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl border border-white/30 shadow-lg rotate-[15deg] flex items-center justify-center z-30 animate-float">
                             <Tag className="w-4.5 h-4.5 text-white" />
                          </div>
                          <div className="absolute top-1/2 right-0 -translate-y-12 w-8 h-8 bg-emerald-500/60 backdrop-blur-md rounded-lg border border-white/20 shadow-lg rotate-[-12deg] flex items-center justify-center z-10 animate-float">
                             <Truck className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
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

        {/* Campaign Card 6.6 Mega Sale */}
        <section className="px-4 py-3 bg-white">
          <div 
            onClick={() => document.getElementById('flash-sale-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative h-[180px] w-full rounded-[28px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white overflow-hidden shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer group"
          >
            {/* Background Decorations */}
            <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
            
            {/* Visual Icon Decoration */}
            <div className="absolute right-4 top-4 opacity-15 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
               <Flame className="w-24 h-24 rotate-12 text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                {/* Badge Event */}
                <div className="bg-white/20 backdrop-blur-md border border-white/10 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] w-fit shadow-sm">
                  EVENT SPESIAL
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black leading-none tracking-tight italic uppercase">
                    6.6 MEGA SALE
                  </h2>
                  <p className="text-[13px] text-white/80 font-medium">
                    Diskon hingga <span className="text-yellow-400 font-black">66%</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-black/10 group-hover:bg-indigo-50 transition-colors">
                  Belanja Sekarang
                </div>
                
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-tight text-cyan-300">
                        Berakhir dalam 02:44:50
                      </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FlashSale />
        <VoucherSection />

        <section className="bg-white py-5 px-4">
          <h2 className="text-base font-bold text-gray-900 mb-4 px-1">Rekomendasi Untukmu</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {recommendationList.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            <FashionDiscoveryCard />
            {recommendationList.slice(4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <PromotionalCards />

        <section className="bg-white py-4 px-4">
          <Tabs defaultValue="viral">
            <TabsList className="bg-transparent border-b border-gray-100 w-full flex justify-start mb-4 gap-6 px-1">
              <TabsTrigger value="viral" className="font-bold text-base px-0">Produk Viral</TabsTrigger>
              <TabsTrigger value="semua" className="font-bold text-base px-0">Semua Produk</TabsTrigger>
            </TabsList>
            <TabsContent value="viral">
              <div className="grid grid-cols-2 gap-3.5">
                {viralProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>
            <TabsContent value="semua">
              <div className="grid grid-cols-2 gap-3.5">
                {Products.filter(p => p.category !== 'Premium').map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
