"use client"

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, ShoppingCart, Heart, Star, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const product = Products.find(p => p.id === Number(id));

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md">
        <Button variant="ghost" size="icon" className="bg-white/80 rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="bg-white/80 rounded-full">
            <Share2 className="w-5 h-5 text-gray-800" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="bg-white/80 rounded-full">
              <ShoppingCart className="w-5 h-5 text-gray-800" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative aspect-square w-full">
        <Image 
          src={product.image || ''} 
          alt={product.name} 
          fill 
          className="object-cover"
          priority
          data-ai-hint="product detail image"
        />
      </div>

      <div className="p-4 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-2xl font-bold text-gray-900 font-headline">Rp {(product.price).toLocaleString()}</p>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Heart className="w-6 h-6" />
          </Button>
        </div>

        <h1 className="text-lg font-medium text-gray-800 mb-3 leading-tight">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-700">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews} ulasan)</span>
          </div>
          <span className="text-xs text-muted-foreground border-l pl-4">Terjual {product.sold}</span>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-semibold">Gratis Ongkir</p>
              <p className="text-xs text-muted-foreground">Pengiriman cepat ke seluruh Indonesia</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-semibold">Produk Original</p>
              <p className="text-xs text-muted-foreground">Jaminan keaslian 100% dari MarPay</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-md font-bold mb-3">Deskripsi Produk</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Produk unggulan dari MarPay dengan kualitas material terbaik dan desain modern yang cocok untuk kebutuhan gaya hidup digital Anda saat ini.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button variant="outline" className="flex-1 border-primary text-primary font-bold h-12 rounded-xl">
          Beli Sekarang
        </Button>
        <Button className="flex-1 bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
          + Keranjang
        </Button>
      </div>
    </div>
  );
}