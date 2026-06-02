'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, X, Search, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products, Categories } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { getProductImage } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { ProductCard } from '@/components/product-grid';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "DANA", "OVO", "GoPay", "Pulsa Telkomsel", "Token PLN", "Netflix Premium", "Canva Pro"
];

const CATEGORY_KEYWORDS_MAP: Record<string, string[]> = {
  'Fashion': ['kaos', 'baju', 'kemeja', 'hoodie', 'pakaian', 'fashion', 't-shirt', 'distro'],
  'Kecantikan': ['skincare', 'serum', 'facial wash', 'sabun wajah', 'kecantikan', 'makeup', 'bioaqua', 'perawatan'],
  'Top Up': ['pulsa', 'isi pulsa', 'token', 'listrik', 'pln', 'token listrik', 'game', 'top up', 'mobile legends', 'ml', 'free fire', 'ff', 'pubg', 'roblox'],
  'E-Wallet': ['dana', 'ovo', 'gopay', 'shopeepay', 'ewallet', 'dompet digital'],
  'Premium': ['premium', 'netflix', 'spotify', 'canva', 'chatgpt', 'youtube premium', 'akun premium'],
};

const SUGGESTIONS_MAP: Record<string, string[]> = {
  'ka': ['kaos', 'kamera', 'kartu perdana'],
  'ke': ['kemeja', 'kecantikan', 'kesehatan'],
  'ba': ['baju', 'batik', 'bayar tagihan'],
  'skin': ['skincare', 'serum wajah', 'facial wash', 'perawatan wajah'],
  'pu': ['pulsa', 'pulsa telkomsel', 'pulsa indosat', 'pulsa murah'],
  'to': ['token pln', 'top up game', 'token listrik'],
  'ew': ['ewallet', 'e-wallet dana', 'e-wallet gopay'],
  'net': ['netflix premium', 'nonton film'],
  'can': ['canva pro', 'canva premium'],
  'gam': ['game', 'top up game', 'gaming'],
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marpay_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

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

  const handleExecuteSearch = (term: string) => {
    setQuery(term);
    saveSearch(term);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('marpay_recent_searches');
  };

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { suggestions: [], categories: [], products: [] };

    let suggestions: string[] = [];
    Object.keys(SUGGESTIONS_MAP).forEach(key => {
      if (q.startsWith(key)) {
        suggestions = [...suggestions, ...SUGGESTIONS_MAP[key]];
      }
    });
    
    const productSuggestions = Products
      .filter(p => p.name.toLowerCase().includes(q))
      .map(p => p.name.split(' ').slice(0, 2).join(' '))
      .slice(0, 3);
      
    suggestions = Array.from(new Set([...suggestions, ...productSuggestions]))
      .filter(s => s.toLowerCase() !== q) 
      .slice(0, 6);

    const matchedCategoryNames: string[] = [];
    Object.entries(CATEGORY_KEYWORDS_MAP).forEach(([catName, keywords]) => {
      if (catName.toLowerCase().includes(q) || keywords.some(k => k.includes(q) || q.includes(k))) {
        matchedCategoryNames.push(catName);
      }
    });

    const matchedCategories = Categories.filter(cat => matchedCategoryNames.includes(cat.name));

    const productsByName = Products.filter(p => p.name.toLowerCase().includes(q));
    const productsByCategory = Products.filter(p => matchedCategoryNames.includes(p.category || ''));
    const allMatchedProducts = Array.from(new Set([...productsByName, ...productsByCategory]));

    return { 
      suggestions, 
      categories: matchedCategories, 
      products: allMatchedProducts 
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-bottom-2 duration-300">
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
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExecuteSearch(query);
              }
            }}
            className="pl-9 pr-9 bg-gray-50 border-none rounded-full h-10 focus-visible:ring-primary/20 text-sm"
          />
          {query && (
            <button 
              onClick={() => {
                setQuery('');
                setShowSuggestions(true);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 bg-gray-200 rounded-full text-gray-500"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50/30">
        {!query ? (
          <div className="p-4 space-y-8 bg-white">
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
                      onClick={() => handleExecuteSearch(term)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      <Clock className="w-3 h-3" />
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pencarian Populer</h3>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button 
                    key={term}
                    onClick={() => handleExecuteSearch(term)}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl text-left hover:border-primary/30 active:bg-gray-50 active:scale-[0.98] transition-all"
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
          <div className="pb-20">
            {/* MODE 1: SEDANG MENGETIK (SUGGESTIONS) */}
            {showSuggestions ? (
              <div className="bg-white">
                {results.suggestions.length > 0 && (
                  <section className="border-b border-gray-50 pb-2">
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saran Pencarian</p>
                    </div>
                    {results.suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleExecuteSearch(s)}
                        className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </button>
                    ))}
                  </section>
                )}

                {results.categories.length > 0 && (
                  <section className="p-4 border-b border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Kategori Terkait</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
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
              </div>
            ) : (
              /* MODE 2: HASIL PENCARIAN (GRID) */
              <div className="space-y-3">
                {results.categories.length > 0 && (
                  <section className="p-4 bg-white border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Kategori Terkait</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
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

                <section className="px-4 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Hasil Pencarian "{query}"
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400">{results.products.length} Produk</span>
                  </div>

                  {results.products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {results.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-white rounded-3xl border border-gray-100 p-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Search className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">Produk tidak ditemukan</h3>
                        <p className="text-[10px] text-gray-400 max-w-[220px]">Maaf, kami tidak dapat menemukan produk yang sesuai dengan kata kunci "{query}".</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
