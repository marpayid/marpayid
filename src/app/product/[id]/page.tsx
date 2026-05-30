"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Share2, ShoppingCart, Heart, Star, ShieldCheck, 
  Truck, ChevronRight, Minus, Plus, MessageCircle, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const product = useMemo(() => Products.find(p => p.id === Number(id)), [id]);

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const variants = product.variants || ['Default'];
  const totalPrice = product.price * quantity;
  const hasDiscount = !!product.originalPrice;
  const savings = hasDiscount ? (product.originalPrice! - product.price) * quantity : 0;

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc') setQuantity(prev => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </Button>
          <span className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{product.name}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="w-5 h-5 text-gray-800" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-14">
        {/* Breadcrumb */}
        <div className="px-4 py-3 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate">{product.name}</span>
        </div>

        {/* Product Image Section */}
        <section className="bg-white">
          <div className="relative aspect-square w-full">
            <Image 
              src={product.image || ''} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
              unoptimized={product.image?.startsWith('/')}
            />
          </div>
          <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn(
                "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2",
                i === 1 ? "border-primary" : "border-gray-100"
              )}>
                <Image 
                  src={product.image || ''} 
                  alt="" 
                  fill 
                  className="object-cover opacity-80"
                  unoptimized={product.image?.startsWith('/')}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Product Info Section */}
        <section className="mt-2 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0">
              {product.category}
            </Badge>
            {product.tag && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0">
                {product.tag}
              </Badge>
            )}
          </div>

          <h1 className="text-md font-medium text-gray-800 mb-2 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{product.rating}</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <span className="text-xs text-gray-500">{product.reviews || '42'} Ulasan</span>
            <div className="h-3 w-px bg-gray-200" />
            <span className="text-xs text-gray-500">Terjual {product.sold}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-primary font-headline">Rp {product.price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through mb-1">Rp {product.originalPrice?.toLocaleString()}</span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
                  {product.discount}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-[10px] text-green-600 font-bold">Hemat Rp {savings.toLocaleString()}</p>
            )}
          </div>
        </section>

        {/* Selection Section */}
        <section className="mt-2 bg-white p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-3">Pilih Varian</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, idx) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(idx)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                    selectedVariant === idx 
                      ? "bg-primary/5 border-primary text-primary shadow-sm" 
                      : "bg-white border-gray-100 text-gray-600"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-800">Atur Jumlah</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Stok: {product.stock || 120}</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary" 
                onClick={() => handleQuantity('dec')}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary" 
                onClick={() => handleQuantity('inc')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mt-2 bg-white p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-gray-700">Proses Cepat</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-gray-700">Transaksi Aman</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-gray-700">Via WhatsApp</p>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="mt-2 bg-white p-4">
          <h3 className="text-sm font-bold mb-3">Deskripsi Produk</h3>
          <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">
            {product.description || `Produk unggulan dari MarPay dengan kualitas material terbaik dan desain modern yang cocok untuk kebutuhan gaya hidup digital Anda saat ini. Kami menjamin setiap produk yang dikirimkan telah melalui tahap inspeksi kualitas yang ketat.`}
          </div>

          <h3 className="text-sm font-bold mb-3">Cara Pemesanan</h3>
          <div className="space-y-4">
            {[
              "Pilih produk dan varian yang Anda inginkan.",
              "Klik tombol 'Beli Sekarang' atau hubungi admin via WhatsApp.",
              "Lakukan pembayaran melalui metode yang tersedia.",
              "Pesanan akan segera diproses secara otomatis atau oleh admin kami."
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Section */}
        <section className="mt-2 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Produk Serupa</h3>
            <Link href="/" className="text-[10px] font-bold text-primary">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Products.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-2 bg-white border-t border-gray-100 p-8 pb-32">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-black italic tracking-tighter text-primary mb-6">MARPAY</div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-xs font-medium text-gray-500">
              <Link href="/">Beranda</Link>
              <Link href="/categories">Produk</Link>
              <Link href="/cart">Keranjang</Link>
              <Link href="/profile">FAQ</Link>
              <Link href="/profile">Kontak</Link>
              <Link href="/profile">Kebijakan Privasi</Link>
            </div>
            <p className="mt-8 text-[10px] text-gray-400">© 2024 MarPay Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col mr-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Harga</p>
          <p className="text-lg font-bold text-primary leading-none">Rp {totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex gap-2 flex-1">
          <Button variant="outline" className="flex-1 border-primary text-primary font-bold h-11 rounded-xl active:scale-95 transition-transform text-xs">
            + Keranjang
          </Button>
          <Link href="/checkout" className="flex-1">
            <Button className="w-full bg-primary text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform text-xs">
              Beli Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
