
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, X, Search, Clock, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products, Categories } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { getProductImage } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "DANA", "OVO", "GoPay", "Pulsa Telkomsel", "Token PLN", "Netflix Premium", "Canva Pro"
];

// Mapping Kategori ke Kata Kunci untuk Sugesti & Matching
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Fashion': ['kaos', 'baju', 'kemeja', 'celana', 'hoodie', 'jaket', 'fashion', 't-shirt'],
  'Kecantikan': ['skincare', 'serum', 'facial wash', 'sabun wajah', 'kecantikan', 'makeup', 'bioaqua', 'perawatan'],
  'Elektronik': ['hp', 'smartphone', 'charger', 'earphone', 'elektronik', 'gadget'],
  'Top Up': ['pulsa', 'token', 'pln', 'ewallet', 'dana', 'ovo', 'gopay', 'top up', 'game', 'ml', 'free fire'],
};

// Map Sugesti Berdasarkan Awalan Kata
const SUGGESTIONS_MAP: Record<string, string[]> = {
  'ka': ['kaos', 'kemeja', 'kamera', 'kartu perdana'],
  'skin': ['skincare', 'serum wajah', 'facial wash', 'perawatan wajah'],
  'ba': ['baju', 'batik', 'bayar tagihan'],
  'pu': ['pulsa', 'pulsa telkomsel', 'pulsa indosat'],
  'to': ['token pln', 'top up game', 'token listrik'],
  'ew': ['ewallet', 'e-wallet dana', 'e-wallet gopay'],
  'net': ['netflix premium', 'nonton film'],
  'can': ['canva pro', 'canva premium'],
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('marpay_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  // Focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('marpay_recent_searches', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('marpay_recent_searches');
  };

  // Logic Pencarian Terintegrasi (Sugesti, Kategori, Produk)
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { suggestions: [], categories: [], products: [] };

    // 1. Get Suggestions
    let suggestions: string[] = [];
    Object.keys(SUGGESTIONS_MAP).forEach(key => {
      if (q.startsWith(key)) {
        suggestions = [...suggestions, ...SUGGESTIONS_MAP[key]];
      }
    });
    // Add dynamic suggestions from product names
    const productSuggestions = Products
      .filter(p => p.name.toLowerCase().includes(q))
      .map(p => p.name.split(' ').slice(0, 2).join(' '))
      .slice(0, 3);
    
    suggestions = Array.from(new Set([...suggestions, ...productSuggestions])).slice(0, 5);

    // 2. Match Categories
    const matchedCategories = Categories.filter(cat => {
      const nameMatch = cat.name.toLowerCase().includes(q);
      const keywords = CATEGORY_KEYWORDS[cat.name] || [];
      const keywordMatch = keywords.some(k => k.includes(q) || q.includes(k));
      return nameMatch || keywordMatch;
    });

    // 3. Match Products
    const matchedProducts = Products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(q);
      const catMatch = product.category?.toLowerCase().includes(q);
      const tagMatch = product.tag?.toLowerCase().includes(q);
      return nameMatch || catMatch || tagMatch;
    });

    return { suggestions, categories: matchedCategories, products: matchedProducts };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -ml-2">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari kebutuhanmu di MarPay..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveSearch(query)}
            className="pl-9 pr-9 bg-gray-50 border-none rounded-full h-10 focus-visible:ring-primary/20 text-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 bg-gray-200 rounded-full text-gray-500"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!query ? (
          <div className="p-4 space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pencarian Terbaru</h3>
                  <button onClick={clearRecent} className="text-[10px] font-bold text-red-500 uppercase">Hapus</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200"
                    >
                      <Clock className="w-3 h-3" />
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Searches */}
            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pencarian Populer</h3>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button 
                    key={term}
                    onClick={() => { setQuery(term); saveSearch(term); }}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl text-left hover:border-primary/30 active:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{term}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="pb-10">
            {/* A. Saran Pencarian */}
            {results.suggestions.length > 0 && (
              <section className="border-b border-gray-50 pb-2">
                <div className="px-4 py-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saran Pencarian</p>
                </div>
                {results.suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setQuery(s); saveSearch(s); }}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-sm text-gray-700">{s}</span>
                  </button>
                ))}
              </section>
            )}

            {/* B. Kategori Terkait */}
            {results.categories.length > 0 && (
              <section className="p-4 border-b border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Kategori Terkait</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {results.categories.map((cat) => {
                    const LucideIcon = (LucideIcons as any)[cat.icon];
                    const catPath = cat.name === 'Top Up' ? '/kategori/top-up' : 
                                   cat.name === 'E-Wallet' ? '/kategori/top-up/e-wallet' :
                                   cat.name === 'Premium' ? '/kategori/premium' :
                                   `/kategori/${cat.name.toLowerCase()}`;

                    return (
                      <Link 
                        key={cat.id} 
                        href={catPath}
                        onClick={() => { saveSearch(query); onClose(); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-primary/30 active:scale-95 transition-all shrink-0"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {LucideIcon && <LucideIcon className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* C. Hasil Produk */}
            <section className="p-4 space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk</p>
              {results.products.length > 0 ? (
                <div className="space-y-3">
                  {results.products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`}
                      onClick={() => { saveSearch(query); onClose(); }}
                      className="flex items-center gap-4 p-2 active:bg-gray-50 rounded-2xl transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 flex-shrink-0">
                        <Image 
                          src={getProductImage(product)} 
                          alt={product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{product.category}</p>
                        <p className="text-sm font-black text-primary mt-1">Rp {product.price.toLocaleString()}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Produk tidak ditemukan</h3>
                    <p className="text-[10px] text-gray-400 max-w-[200px]">Gunakan kata kunci lain atau cek kategori populer di atas.</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
