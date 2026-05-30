import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import { Products } from '@/app/lib/dummy-data';
import { Button } from './ui/button';

export function ProductGrid() {
  return (
    <section className="mt-6 px-4 pb-24">
      <h2 className="text-lg font-headline font-bold text-gray-900 mb-4">Rekomendasi Untukmu</h2>
      <div className="grid grid-cols-2 gap-3">
        {Products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <Link href={`/product/${product.id}`} className="relative aspect-square">
              <Image 
                src={product.image || ''} 
                alt={product.name} 
                fill 
                className="object-cover"
                data-ai-hint="product image"
              />
            </Link>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug h-8 mb-1">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-semibold text-gray-600">{product.rating}</span>
                  <span className="text-[10px] text-muted-foreground">| Terjual {product.sold}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                <p className="text-sm font-bold text-gray-900">Rp {(product.price/1000).toLocaleString()}rb</p>
                <Button size="icon" className="w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}