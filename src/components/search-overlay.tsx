'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const popularKeywords = [
    'Case iPhone', 'Skincare', 'Celana', 'Kemeja', 'Akrilik', 'Top Up', 'Pulsa'
  ];

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Focus and Scroll Lock
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setInputValue('');
      setDebouncedQuery('');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Recommendation Data (Limited)
  const recommendations = useMemo(() => {
    return Products.filter(p => p.tag === 'Produk Viral').slice(0, 4);
  }, []);

  // Search Logic
  const searchResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    
    return Products.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const variantMatch = p.variants?.some(v => v.toLowerCase().includes(q));
      return nameMatch || categoryMatch || descMatch || variantMatch;
    });
  }, [debouncedQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-200">
      {/* Search Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari produk di MarPay..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-4 bg-gray-50 border-none rounded-full h-11 focus-visible:ring-primary/20 text-sm"
          />
        </div>
      </header>

      {/* Search Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        {!debouncedQuery ? (
          <div className="p-4 space-y-8">
            {/* Pencarian Populer Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pencarian Populer</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setInputValue(kw)}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-600 active:bg-primary active:text-white active:border-primary transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </section>

            {/* Rekomendasi Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rekomendasi Untukmu</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-primary font-bold text-xs h-10 rounded-xl"
                onClick={onClose}
              >
                Lihat Semua Produk
              </Button>
            </section>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {searchResults.length > 0 ? (
              <>
                <h2 className="text-sm font-bold text-gray-500 px-1">
                  Hasil pencarian untuk <span className="text-primary">"{debouncedQuery}"</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-50">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-300" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">Produk tidak ditemukan</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Coba gunakan kata kunci lain yang lebih spesifik</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setInputValue('')}
                  className="rounded-full px-6 h-10 border-gray-200 text-xs font-bold"
                >
                  Hapus Pencarian
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
