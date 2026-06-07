
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, ShoppingBag, Star, Minus, Plus, Info, Heart, LayoutGrid, Loader2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatSold, formatReviews, getProductImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/product-grid';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();
  
  const product = useMemo(() => {
    return Products.find(p => String(p.id) === id);
  }, [id]);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const informativeKeywords = useMemo(() => ['detail', 'belakang', 'size', 'chart', 'tabel', 'ukuran', 'depan', 'view'], []);

  const selectableColors = useMemo(() => {
    if (!product?.colors) return [];
    return product.colors.filter((c: any) => {
      const name = (typeof c === 'object' ? c.name : String(c)).toLowerCase();
      return !informativeKeywords.some(keyword => name.includes(keyword));
    });
  }, [product, informativeKeywords]);

  const galleryItems = useMemo(() => {
    if (!product) return [];
    const items: { url: string; colorName?: string }[] = [];
    const seenUrls = new Set<string>();

    const mainImg = getProductImage(product);
    items.push({ url: mainImg });
    seenUrls.add(mainImg);

    product.colors?.forEach((c: any) => {
      if (typeof c === 'object' && c.imageUrl && !seenUrls.has(c.imageUrl)) {
        items.push({ 
          url: c.imageUrl, 
          colorName: !informativeKeywords.some(k => c.name.toLowerCase().includes(k)) ? c.name : undefined 
        });
        seenUrls.add(c.imageUrl);
      }
    });

    return items;
  }, [product, informativeKeywords]);

  useEffect(() => {
    if (product) {
      const viewedCats = JSON.parse(localStorage.getItem('marpay_viewed_cats') || '[]');
      const viewedGenders = JSON.parse(localStorage.getItem('marpay_viewed_genders') || '[]');
      
      const newCats = [product.category, ...viewedCats.filter((c: string) => c !== product.category)].slice(0, 10);
      localStorage.setItem('marpay_viewed_cats', JSON.stringify(newCats));
      
      const gender = product.gender || (product.name.toLowerCase().includes('pria') ? 'male' : product.name.toLowerCase().includes('wanita') ? 'female' : 'unisex');
      const newGenders = [gender, ...viewedGenders].slice(0, 20);
      localStorage.setItem('marpay_viewed_genders', JSON.stringify(newGenders));
    }
  }, [product]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const handleColorSelect = useCallback((index: number, colorName: string) => {
    setSelectedColorIndex(index);
    if (!api) return;

    const slideIndex = galleryItems.findIndex(item => item.colorName === colorName);
    if (slideIndex !== -1) {
      api.scrollTo(slideIndex);
    }
  }, [api, galleryItems]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    
    if (String(product.id) === '219') {
      const colorName = selectableColors[selectedColorIndex]?.name;
      if (colorName === 'NEW PDRN-30g' || colorName === 'Retinol 30g') return 48000;
    }
    if (String(product.id) === '214' && selectableColors[selectedColorIndex]?.name === '100 ml') return 30129;
    if (String(product.id) === '208' && selectedVariantIndex === 2) return 45000;
    if (String(product.id) === '203') {
      if (selectedVariantIndex === 1) return 63102;
      if (selectedVariantIndex === 2) return 70000;
    }
    if (String(product.id) === '201' && (product.variants?.[selectedVariantIndex] || '').match(/14|15|16|17/)) return 17999;
    if (String(product.id) === '2' && selectedVariantIndex === 1) return 309000;
    
    return product.price;
  }, [product, selectedVariantIndex, selectedColorIndex, selectableColors]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return Products.filter(p => 
      p.category === product.category && 
      String(p.id) !== String(product.id) && 
      p.category !== 'Premium'
    ).slice(0, 4);
  }, [product]);

  const handleAction = useCallback((redirect = false) => {
    if (!product) return;
    
    const currentColor = selectableColors[selectedColorIndex];
    const colorName = currentColor ? (typeof currentColor === 'object' ? currentColor.name : String(currentColor)) : '';
    const variants = product.variants || ['Default'];
    
    const variantString = colorName 
      ? `${variants[selectedVariantIndex]} - ${colorName}` 
      : variants[selectedVariantIndex];

    const activeImage = galleryItems[currentSlide]?.url || getProductImage(product);

    const item = { 
      id: product.id, 
      name: product.name, 
      price: currentPrice, 
      image: activeImage, 
      variant: variantString, 
      quantity: quantity, 
      type: product.type || 'physical', 
      category: product.category, 
      shippingFee: product.shippingFee || 0 
    };

    if (redirect) {
      localStorage.setItem('marpay_checkout_temp', JSON.stringify([item]));
      router.push('/checkout');
    } else {
      const savedCart = localStorage.getItem('marpay_cart');
      let cart = savedCart ? JSON.parse(savedCart) : [];
      const existingIndex = cart.findIndex((i: any) => String(i.id) === String(item.id) && i.variant === item.variant);
      if (existingIndex > -1) cart[existingIndex].quantity += quantity;
      else cart.push(item);
      localStorage.setItem('marpay_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      toast({ variant: "success", title: "Masuk Keranjang" });
    }
  }, [product, selectableColors, selectedColorIndex, selectedVariantIndex, currentPrice, quantity, currentSlide, galleryItems, router, toast]);

  if (!product) return <div className="p-8 text-center font-bold">Produk tidak ditemukan</div>;

  const variants = product.variants || ['Default'];
  const totalPrice = currentPrice * quantity;

  return (
    <div className="bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
          <span className="text-sm font-bold truncate max-w-[180px]">{product.name}</span>
        </div>
        <Link href="/cart"><Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button></Link>
      </header>

      <main className="pt-14">
        {/* Gallery Carousel */}
        <div className="relative w-full bg-white group overflow-hidden">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {galleryItems.map((item, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative aspect-square w-full">
                    <Image 
                      src={item.url} 
                      alt={`${product.name} - ${idx + 1}`} 
                      fill 
                      className="object-cover" 
                      priority={idx === 0} 
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {galleryItems.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                {galleryItems.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentSlide === idx ? "w-6 bg-primary" : "w-1.5 bg-black/20"
                    )}
                  />
                ))}
              </div>
            )}
          </Carousel>
          
          {galleryItems.length > 1 && (
             <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-800"><ChevronLeft className="w-5 h-5" /></div>
                <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-800"><ChevronRight className="w-5 h-5" /></div>
             </div>
          )}
        </div>

        <section className="mt-2 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold">{product.category}</Badge>
            {product.isFlashSale && <Badge className="bg-red-600 text-white text-[10px] uppercase">🔥 Flash Sale</Badge>}
          </div>
          <h1 className="text-md font-medium text-gray-800 mb-2 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-700">{product.rating}</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <span>{formatReviews(product.reviews || 0)} Ulasan</span>
            <div className="h-3 w-px bg-gray-200" />
            <span>{formatSold(product.sold || 0)}</span>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-primary">Rp {currentPrice.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through mb-1">Rp {product.originalPrice.toLocaleString()}</span>}
          </div>
        </section>

        <section className="mt-2 bg-white p-4 space-y-5">
          {selectableColors.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase mb-3 ml-0.5">Pilihan Warna</p>
              <div className="flex flex-wrap gap-2.5">
                {selectableColors.map((c: any, i: number) => {
                  const colorName = typeof c === 'object' ? c.name : String(c);
                  const isActive = selectedColorIndex === i;
                  return (
                    <button 
                      key={`${colorName}-${i}`} 
                      onClick={() => handleColorSelect(i, colorName)}
                      type="button"
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95", 
                        isActive 
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/30 shadow-sm" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {variants.length > 1 && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase mb-3 ml-0.5">Varian Ukuran</p>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((v: string, i: number) => {
                  const isActive = selectedVariantIndex === i;
                  return (
                    <button 
                      key={`${v}-${i}`} 
                      onClick={() => setSelectedVariantIndex(i)} 
                      type="button"
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95", 
                        isActive 
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/30 shadow-sm" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase ml-0.5">Jumlah</p>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg active:bg-white" 
                onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold w-4 text-center select-none">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg active:bg-white" 
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
            <Info className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold uppercase tracking-tight">Deskripsi Produk</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          <div className="h-6"></div>
        </section>

        {similarProducts.length > 0 && (
          <section className="mt-2 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-tight">Produk Serupa</h2>
              </div>
              <Link href={`/kategori/${product.category.toLowerCase()}`} className="text-[10px] font-bold text-primary">Lihat Semua</Link>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3 z-[200] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col min-w-[100px]">
           <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">TOTAL HARGA</p>
           <p className="text-lg font-black text-primary leading-none">Rp {totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex gap-2 flex-1">
          <Button variant="outline" className="flex-1 border-primary text-primary font-bold h-11 rounded-xl text-xs active:scale-95" onClick={() => handleAction(false)}>+ Keranjang</Button>
          <Button className="flex-1 bg-primary text-white font-bold h-11 rounded-xl shadow-lg text-xs active:scale-95" onClick={() => handleAction(true)}>Beli Sekarang</Button>
        </div>
      </div>
    </div>
  );
}
