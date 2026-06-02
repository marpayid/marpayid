
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Share2, ShoppingBag, Heart, Star, ShieldCheck, 
  Truck, ChevronRight, Minus, Plus, MessageCircle, AlertCircle
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

  const product = useMemo(() => Products.find(p => p.id === Number(id)), [id]);
  const isOutOfStock = product?.stock === 'Stok Habis';
  
  const displayImage = getProductImage(product);
  const [activeImage, setActiveImage] = useState(displayImage);

  useEffect(() => {
    if (product) {
      setActiveImage(getProductImage(product));
    }
  }, [product]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return Products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [product]);

  const otherProducts = useMemo(() => {
    if (!product) return [];
    const inCategory = Products.filter(p => p.category === product.category && p.id !== product.id);
    const others = Products.filter(p => p.category !== product.category && p.id !== product.id);
    return [...inCategory, ...others].slice(0, 10);
  }, [product]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (product.id === 2) {
      return selectedVariant === 1 ? 309000 : 269000;
    }
    return product.price;
  }, [product, selectedVariant]);

  if (!product) return <div className="p-8 text-center font-bold">Produk tidak ditemukan</div>;

  const variants = product.variants || ['Default'];
  const totalPrice = currentPrice * quantity;
  const hasDiscount = !!product.originalPrice;

  // REVISI LOGIKA TAMPILAN: Hanya tampilkan info jika GRATIS ONGKIR
  const hasShippingFee = (product.shippingFee || 0) > 0;

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (isOutOfStock) return;
    if (type === 'inc') setQuantity(prev => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAction = (redirect = false) => {
    if (isOutOfStock) {
      toast({ variant: "destructive", title: "Stok Habis", description: "Maaf, produk ini sedang tidak tersedia.", duration: 2000 });
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: activeImage,
      variant: variants[selectedVariant],
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
      toast({ variant: "default", title: "Masuk Keranjang", description: "Siap untuk checkout", duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}><ArrowLeft className="w-5 h-5 text-gray-800" /></Button>
          <span className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{product.name}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9"><Share2 className="w-5 h-5 text-gray-800" /></Button>
          <Link href="/cart"><Button variant="ghost" size="icon" className="h-9 w-9 relative"><ShoppingBag className="w-5 h-5 text-gray-800" /></Button></Link>
        </div>
      </header>

      <main className="pt-14">
        <div className="px-4 py-3 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
          <Link href="/" className="hover:text-primary">Beranda</Link><ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary">{product.category}</span><ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate">{product.name}</span>
        </div>

        <section className="bg-white">
          <div className="relative aspect-square w-full">
            <Image src={activeImage} alt={product.name} fill className={cn("object-cover", isOutOfStock && "grayscale")} priority />
            {isOutOfStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="bg-red-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-[0.2em] shadow-2xl">Stok Habis</div></div>}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 px-4 py-4 overflow-x-auto no-scrollbar bg-white">
              {product.images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setActiveImage(img)} className={cn("relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all", activeImage === img ? "border-primary shadow-sm" : "border-gray-100 bg-gray-50 opacity-70")}>
                  <Image src={img} alt={`${product.name} detail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* REVISI: Hanya tampilkan spanduk ongkir jika GRATIS ONGKIR */}
        {product.type !== 'digital' && !isOutOfStock && !hasShippingFee && (
          <section className="mx-4 my-2 bg-white border border-[#22c55e]/15 rounded-[10px] px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3 h-[60px]">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-500 shrink-0"><Truck className="w-7 h-7" /></div>
            <div className="flex-1">
              <p className="text-[12px] font-black text-green-600 uppercase tracking-tight mb-0">
                GRATIS ONGKIR
              </p>
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                Potongan Maksimal Rp20.000
              </p>
            </div>
          </section>
        )}

        <section className="mt-2 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0">{product.category}</Badge>
            {product.tag && <Badge variant="secondary" className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0">{product.tag}</Badge>}
            {isOutOfStock && <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold px-2 py-0">Stok Habis</Badge>}
          </div>
          <h1 className="text-md font-medium text-gray-800 mb-2 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-bold text-gray-700">{product.rating || '0.0'}</span></div>
            <div className="h-3 w-px bg-gray-200" /><span className="text-xs text-gray-500">{product.reviews || '0'} Ulasan</span>
            <div className="h-3 w-px bg-gray-200" /><span className="text-xs text-gray-500">{formatSold(product.sold || 0)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-primary font-headline">Rp {currentPrice.toLocaleString()}</span>
              {hasDiscount && <span className="text-sm text-gray-400 line-through mb-1">Rp {product.originalPrice?.toLocaleString()}</span>}
            </div>
            {/* REVISI: Info biaya pengiriman diringkas untuk menjaga psikologi pembeli */}
            {!hasShippingFee && (
              <p className="text-[11px] font-bold text-green-500 uppercase mt-1">
                Layanan: <span className="ml-1">Gratis Ongkir</span>
              </p>
            )}
          </div>
        </section>

        <section className="mt-2 bg-white p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-3">Pilih Varian</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, idx) => (
                <button key={v} onClick={() => setSelectedVariant(idx)} className={cn("px-4 py-2 rounded-lg text-xs font-medium border transition-all", selectedVariant === idx ? "bg-primary/5 border-primary text-primary shadow-sm" : "bg-white border-gray-100 text-gray-600")}>{v}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div><h3 className="text-xs font-bold text-gray-800">Atur Jumlah</h3><p className="text-[10px] text-gray-400 mt-0.5">Stok: {isOutOfStock ? '0' : (product.stock || 120)}</p></div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleQuantity('dec')} disabled={quantity <= 1 || isOutOfStock}><Minus className="w-4 h-4" /></Button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleQuantity('inc')} disabled={isOutOfStock}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white p-4"><h3 className="text-sm font-bold mb-3">Deskripsi Produk</h3><div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">{product.description}</div></section>

        {similarProducts.length > 0 && (
          <section className="mt-6 bg-white py-6">
            <div className="px-4 mb-4"><h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Produk Serupa</h3><p className="text-[10px] text-gray-400 font-medium">Rekomendasi dalam kategori yang sama</p></div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4">{similarProducts.map((p) => (<ProductCard key={p.id} product={p} compact={true} />))}</div>
          </section>
        )}

        <section className="mt-6 bg-white py-6 px-4">
          <div className="mb-6"><h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Mungkin Anda Suka</h3><p className="text-[10px] text-gray-400 font-medium">Pilihan produk terbaik untuk Anda</p></div>
          <div className="grid grid-cols-2 gap-4">{otherProducts.map((p) => (<ProductCard key={p.id} product={p} />))}</div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col mr-4"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Harga</p><p className="text-lg font-bold text-primary leading-none">Rp {totalPrice.toLocaleString()}</p></div>
        <div className="flex gap-2 flex-1">
          <Button variant="outline" disabled={isOutOfStock} className={cn("flex-1 border-primary text-primary font-bold h-11 rounded-xl active:scale-95 transition-transform text-xs", isOutOfStock && "opacity-50 grayscale cursor-not-allowed")} onClick={() => handleAction(false)}>+ Keranjang</Button>
          <Button disabled={isOutOfStock} className={cn("flex-1 bg-primary text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform text-xs", isOutOfStock && "bg-gray-400 shadow-none cursor-not-allowed")} onClick={() => handleAction(true)}>{isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}</Button>
        </div>
      </div>
    </div>
  );
}
