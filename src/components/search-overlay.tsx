'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, TrendingUp, History, X, ChevronRight, LayoutGrid, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortOption = 'semua' | 'terlaris' | 'harga_rendah' | 'terbaru';

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [confirmedQuery, setConfirmedQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption>('semua');
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
    if (isOpen) {
      const savedHistory = localStorage.getItem('marpay_search_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      setInputValue('');
      setShowResults(false);
      setConfirmedQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addToHistory = (query: string) => {
    const q = query.trim();
    if (!q) return;
    const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('marpay_search_history', JSON.stringify(newHistory));
  };

  const handleConfirmSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setInputValue(q);
    setConfirmedQuery(q);
    setShowResults(true);
    addToHistory(q);
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    localStorage.setItem('marpay_search_history', JSON.stringify(newHistory));
  };

  // Generate suggestions based on input (TEXT ONLY)
  const suggestions = useMemo(() => {
    const q = inputValue.toLowerCase().trim();
    if (!q || showResults) return [];

    const matches = new Set<string>();
    
    // Logic to find relevant keywords from products
    Products.forEach(p => {
      const name = p.name.toLowerCase();
      const cat = p.category?.toLowerCase() || '';
      
      if (name.includes(q)) {
        // Find the first 2-3 words of the product name that contain the query for cleaner suggestion
        const words = name.split(' ');
        const queryIdx = words.findIndex(w => w.includes(q));
        if (queryIdx !== -1) {
          const suggestion = words.slice(queryIdx, queryIdx + 3).join(' ');
          matches.add(suggestion);
        }
      }
      if (cat.includes(q)) matches.add(cat);
    });

    // Add common variants if match query
    const commonPrefixes = ['case', 'celana', 'skincare', 'baju', 'kaos', 'promo'];
    commonPrefixes.forEach(prefix => {
      if (prefix.includes(q) || q.includes(prefix)) {
        if (prefix === 'case') {
          ['case iphone', 'case magsafe', 'case premium', 'case anti shock', 'case street art'].forEach(s => {
            if (s.includes(q)) matches.add(s);
          });
        }
        if (prefix === 'celana') {
          ['celana wanita', 'celana stripe', 'celana baggy', 'celana panjang'].forEach(s => {
            if (s.includes(q)) matches.add(s);
          });
        }
      }
    });

    return Array.from(matches).slice(0, 10);
  }, [inputValue, showResults]);

  // Filter and sort results
  const finalResults = useMemo(() => {
    if (!confirmedQuery) return [];
    const q = confirmedQuery.toLowerCase();
    
    let filtered = Products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );

    // Sorting logic
    switch (activeSort) {
      case 'terlaris':
        return [...filtered].sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case 'harga_rendah':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'terbaru':
        return [...filtered].sort((a, b) => b.id - a.id);
      default:
        return filtered;
    }
  }, [confirmedQuery, activeSort]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Search Header - Marketplace Style */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0 -ml-2 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <form 
          className="relative flex-1" 
          onSubmit={(e) => { e.preventDefault(); handleConfirmSearch(inputValue); }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari produk di MarPay..." 
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowResults(false);
            }}
            className="pl-10 pr-10 bg-gray-100 border-none rounded-xl h-10 focus-visible:ring-primary/20 text-sm"
          />
          {inputValue && (
            <button 
              type="button"
              onClick={() => { setInputValue(''); setShowResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-400 rounded-full text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* STATE 1: EMPTY INPUT (History & Popular) */}
        {!inputValue && !showResults && (
          <div className="py-2">
            {history.length > 0 && (
              <section className="mb-6 px-4">
                <div className="flex items-center justify-between py-3">
                  <h2 className="text-[13px] font-bold text-gray-900">Riwayat Pencarian</h2>
                  <button onClick={() => { setHistory([]); localStorage.removeItem('marpay_search_history'); }} className="text-[11px] font-bold text-red-500">Hapus Semua</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <div
                      key={h}
                      onClick={() => handleConfirmSearch(h)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 active:bg-gray-100 cursor-pointer"
                    >
                      <Clock className="w-3 h-3 text-gray-400" />
                      {h}
                      <button onClick={(e) => removeHistoryItem(e, h)} className="p-0.5 hover:text-red-500 ml-1">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-6 px-4">
              <div className="flex items-center gap-2 py-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h2 className="text-[13px] font-bold text-gray-900">Pencarian Populer</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleConfirmSearch(kw)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-700 shadow-sm active:border-primary active:text-primary transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-6 px-4">
              <div className="flex items-center gap-2 py-3">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-[13px] font-bold text-gray-900">Kategori Terpopuler</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleConfirmSearch(cat.name)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent active:border-primary/20 transition-all"
                  >
                    <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* STATE 2: TEXT SUGGESTIONS (While Typing) - Shopee Style */}
        {inputValue && !showResults && (
          <div className="bg-white">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleConfirmSearch(item)}
                  className="px-4 py-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-800 capitalize">{item}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))
            ) : (
              <div 
                onClick={() => handleConfirmSearch(inputValue)}
                className="px-4 py-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">Cari "{inputValue}"</span>
                </div>
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        )}

        {/* STATE 3: PRODUCT RESULTS (After Enter/Click) */}
        {showResults && (
          <div className="flex flex-col h-full bg-gray-50">
            {/* Professional Sorting Tabs */}
            <div className="bg-white border-b border-gray-100 flex items-center sticky top-0 z-20">
              {(['semua', 'terlaris', 'harga_rendah', 'terbaru'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveSort(opt)}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2",
                    activeSort === opt ? "text-primary border-primary" : "text-gray-400 border-transparent"
                  )}
                >
                  {opt === 'harga_rendah' ? 'Harga' : opt}
                </button>
              ))}
            </div>

            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                  Hasil untuk <span className="text-primary">"{confirmedQuery}"</span>
                </h2>
                <span className="text-[10px] font-bold text-gray-400">{finalResults.length} Produk</span>
              </div>

              {finalResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {finalResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Search className="w-10 h-10 text-gray-100" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Produk tidak ditemukan</h3>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                    Coba gunakan kata kunci lain yang lebih umum atau cek ejaanmu ya.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
