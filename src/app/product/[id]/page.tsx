
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, Star, Minus, Plus, Info, Heart, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatSold, getProductImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/product-grid';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  const product = useMemo(() => Products.find(p => p.id === Number(id)), [id]);
  const isOutOfStock = product?.stock === 'Stok Habis';
  
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product) setActiveImage(getProductImage(product));
  }, [product]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    
    // Special Pricing Logic for Wardah (ID: 208)
    if (product.id === 208) {
      if (selectedVariant === 2) return 45000; // Acne Calming SPF50 40ml
      return 28000; // default for SPF50 25ml and SPF35 35ml
    }
    
    // Special Pricing Logic for Everyday Pants (ID: 203)
    if (product.id === 203) {
      if (selectedVariant === 1) return 63102; // Jumbo
      if (selectedVariant === 2) return 70000; // Super Jumbo
      return 59252; // Standar
    }
    // Special Pricing Logic for Case iPhone Clear (ID: 201)
    if (product.id === 201) {
      const variantName = product.variants?.[selectedVariant] || '';
      if (variantName.includes('14') || variantName.includes('15') || variantName.includes('16') || variantName.includes('17')) {
        return 17999;
      }
      return 14899;
    }
    // Special Pricing Logic for Akrilik (ID: 2)
    if (product.id === 2 && selectedVariant === 1) return 309000;
    
    return product.price;
  }, [product, selectedVariant]);

  // Logic for Similar and Recommended Products (Mengecualikan kategori Premium)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    // Jangan tampilkan rekomendasi premium di bagian serupa/suka
    return Products.filter(p => 
      p.category === product.category && 
      p.id !== product.id && 
      p.category !== 'Premium'
    ).slice(0, 4);
  }, [product]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    const excludedIds = [product.id, ...similarProducts.map(p => p.id)];
    return Products.filter(p => 
      !excludedIds.includes(p.id) && 
      p.category !== 'Premium'
    ).slice(0, 4);
  }, [product, similarProducts]);

  if (!product) return <div className="p-8 text-center font-bold">Produk tidak ditemukan</div>;

  const variants = product.variants || ['Default'];
  const colors = product.colors || [];
  const totalPrice = currentPrice * quantity;

  // Custom Description Override for BIOAQUA
  const displayDescription = product.id === 1 
    ? "BIOAQUA Skincare 1 Set Lengkap 6pcs hadir dengan pilihan Whitening Set and Anti-Acne Set. Cocok untuk perawatan wajah harian agar kulit terlihat lebih bersih, segar, dan terawat. Produk dikemas rapi dan siap dikirim."
    : product.description;

  const handleAction = (redirect = false) => {
    if (isOutOfStock) return;
    const variantString = colors.length > 0 ? `${variants[selectedVariant]} - ${colors[selectedColor]}` : variants[selectedVariant];
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
      const existingIndex = cart.findIndex((i: any) => i.id === item.id && i.variant === item.variant);
      if (existingIndex > -1) cart[existingIndex].quantity += quantity;
      else cart.push(item);
      localStorage.setItem('marpay_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      toast({ variant: "default", title: "Masuk Keranjang" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
          <span className="text-sm font-bold truncate max-w-[150px]">{product.name}</span>
        </div>
        <Link href="/cart"><Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button></Link>
      </header>

      <main className="pt-14">
        <div className="relative aspect-square w-full bg-white">
          <Image src={activeImage || getProductImage(product)} alt={product.name} fill className="object-cover" priority />
        </div>

        <section className="mt-2 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold">{product.category}</Badge>
            {product.isFlashSale && <Badge className="bg-red-600 text-white text-[10px] uppercase">🔥 Flash Sale</Badge>}
          </div>
          <h1 className="text-md font-medium text-gray-800 mb-2 leading-tight">{product.name}</h1>
          
          {/* RATING & REVIEWS AREA */}
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-700">{product.rating}</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <span>{product.reviews || '0'} Ulasan</span>
            <div className="h-3 w-px bg-gray-200" />
            <span>{formatSold(product.sold || 0)}</span>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-primary">Rp {currentPrice.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through mb-1">Rp {product.originalPrice.toLocaleString()}</span>}
          </div>
        </section>

        <section className="mt-2 bg-white p-4 space-y-4">
          {colors.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Warna</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c: string, i: number) => (
                  <button key={c} onClick={() => setSelectedColor(i)} className={cn("px-4 py-2 rounded-lg text-xs border", selectedColor === i ? "border-primary bg-primary/5 text-primary" : "border-gray-100")}>{c}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Varian</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button key={v} onClick={() => setSelectedVariant(i)} className={cn("px-4 py-2 rounded-lg text-xs border", selectedVariant === i ? "border-primary bg-primary/5 text-primary" : "border-gray-100")}>{v}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Jumlah</p>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}><Minus className="w-4 h-4" /></Button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(prev => prev + 1)}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </section>

        {/* Section: Deskripsi Produk */}
        <section className="mt-2 bg-white p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
            <Info className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold uppercase tracking-tight">Deskripsi Produk</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {displayDescription}
          </p>
        </section>

        {/* Section: Produk Serupa */}
        {similarProducts.length > 0 && (
          <section className="mt-2 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-tight">Produk Serupa</h2>
              </div>
              <Link href={`/kategori/${product.category.toLowerCase()}`} className="text-[10px] font-bold text-primary">Lihat Semua</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Section: Yang Mungkin Anda Suka */}
        {recommendedProducts.length > 0 && (
          <section className="mt-2 bg-white p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold uppercase tracking-tight">Yang Mungkin Anda Suka</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FIXED ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3 z-[100] shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col min-w-[100px]">
           <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">TOTAL HARGA</p>
           <p className="text-lg font-black text-primary leading-none">Rp {totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex gap-2 flex-1">
          <Button variant="outline" className="flex-1 border-primary text-primary font-bold h-11 rounded-xl text-xs" onClick={() => handleAction(false)}>+ Keranjang</Button>
          <Button className="flex-1 bg-primary text-white font-bold h-11 rounded-xl shadow-lg text-xs" onClick={() => handleAction(true)}>Beli Sekarang</Button>
        </div>
      </div>
    </div>
  );
}
