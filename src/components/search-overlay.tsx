'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, TrendingUp, History, X, ChevronRight, LayoutGrid } from 'lucide-react';
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
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularKeywords = [
    'Case iPhone', 'Skincare', 'Celana', 'Kemeja', 'Akrilik', 'Top Up', 'Pulsa'
  ];

  const popularCategories = [
    { name: 'Top Up', icon: 'Zap' },
    { name: 'Fashion', icon: 'Shirt' },
    { name: 'Premium', icon: 'Crown' },
    { name: 'Game', icon: 'Gamepad2' },
  ];

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('marpay_search_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [isOpen]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      // Add to history if query is significant
      if (inputValue.trim().length > 2 && !history.includes(inputValue.trim())) {
        const newHistory = [inputValue.trim(), ...history.slice(0, 4)];
        setHistory(newHistory);
        localStorage.setItem('marpay_search_history', JSON.stringify(newHistory));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Focus and Scroll Lock
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('marpay_search_history');
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    localStorage.setItem('marpay_search_history', JSON.stringify(newHistory));
  };

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

  const recommendations = useMemo(() => {
    return Products.filter(p => p.tag === 'Produk Viral').slice(0, 4);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Search Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0 -ml-2 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari produk di MarPay..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-10 bg-gray-100 border-none rounded-xl h-10 focus-visible:ring-primary/20 text-sm"
          />
          {inputValue && (
            <button 
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-300 rounded-full text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!inputValue ? (
          <div className="py-2">
            {/* Riwayat Pencarian */}
            {history.length > 0 && (
              <section className="mb-6 px-4">
                <div className="flex items-center justify-between py-3">
                  <h2 className="text-[13px] font-bold text-gray-900">Riwayat Pencarian</h2>
                  <button onClick={clearHistory} className="text-[11px] font-bold text-red-500">Hapus Semua</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <div
                      key={h}
                      onClick={() => setInputValue(h)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 active:bg-gray-100"
                    >
                      <History className="w-3 h-3 text-gray-400" />
                      {h}
                      <button onClick={(e) => removeHistoryItem(e, h)} className="p-0.5 hover:text-red-500">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pencarian Populer */}
            <section className="mb-6 px-4">
              <div className="flex items-center gap-2 py-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h2 className="text-[13px] font-bold text-gray-900">Pencarian Populer</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setInputValue(kw)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-700 shadow-sm active:border-primary active:text-primary transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </section>

            {/* Kategori Terpopuler */}
            <section className="mb-6 px-4">
              <div className="flex items-center gap-2 py-3">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-[13px] font-bold text-gray-900">Kategori Terpopuler</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setInputValue(cat.name)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent active:border-primary/20 transition-all"
                  >
                    <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </button>
                ))}
              </div>
            </section>

            {/* Rekomendasi Horizontal */}
            <section className="mt-8 border-t border-gray-50 pt-4">
              <div className="flex items-center justify-between px-4 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <h2 className="text-[13px] font-bold text-gray-900">Rekomendasi Untukmu</h2>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
                {recommendations.map((product) => (
                  <div key={product.id} className="min-w-[140px] max-w-[140px]">
                    <ProductCard product={product} compact={true} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="p-4">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                  <h2 className="text-sm font-bold text-gray-500">
                    Hasil untuk <span className="text-primary font-black">"{inputValue}"</span>
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400">{searchResults.length} Produk</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Wah, produk tidak ditemukan</h3>
                <p className="text-[11px] text-gray-400 mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                  Coba gunakan kata kunci lain yang lebih umum atau cek ejaanmu ya.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setInputValue('')}
                  className="mt-8 rounded-xl px-8 h-11 border-primary/20 text-primary text-xs font-bold"
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
