
'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Search, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { getProductImage } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "DANA", "OVO", "GoPay", "Pulsa Telkomsel", "Token PLN", "Netflix Premium", "Canva Pro"
];

// Mapping kata kunci ke kategori untuk meningkatkan relevansi pencarian
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'fashion': ['fashion', 'baju', 'kaos', 'kemeja', 'pakaian', 'celana', 'topi', 'jaket'],
  'kecantikan': ['skincare', 'serum', 'facial wash', 'sabun muka', 'kecantikan', 'bioaqua', 'perawatan', 'wajah', 'glowing'],
  'premium': ['premium', 'netflix', 'spotify', 'canva', 'chatgpt', 'youtube premium', 'streaming', 'akun', 'nonton'],
  'top up': ['pulsa', 'isi pulsa', 'token listrik', 'listrik', 'pln', 'token', 'game', 'top up', 'top up game', 'ml', 'mobile legends', 'ff', 'free fire', 'pubg', 'roblox'],
  'e-wallet': ['dana', 'ovo', 'gopay', 'shopeepay', 'ewallet', 'dompet digital', 'saldo'],
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('marpay_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  // Focus input when opened
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

  // Algoritma pencarian yang ditingkatkan
  const getFilteredProducts = () => {
    const searchLower = query.toLowerCase().trim();
    if (!searchLower) return [];

    // Mencari kategori yang cocok berdasarkan sinonim
    const matchedCategoryKeys = Object.keys(CATEGORY_SYNONYMS).filter(catKey => 
      CATEGORY_SYNONYMS[catKey].some(keyword => 
        searchLower.includes(keyword) || keyword.includes(searchLower)
      )
    );

    return Products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.toLowerCase().includes(searchLower);
      const tagMatch = product.tag?.toLowerCase().includes(searchLower);
      const descMatch = product.description?.toLowerCase().includes(searchLower);
      
      // Jika kata kunci pencarian cocok dengan daftar sinonim kategori, tampilkan produk di kategori tersebut
      const synonymCategoryMatch = matchedCategoryKeys.some(catKey => 
        product.category?.toLowerCase().includes(catKey)
      );

      // Prioritas: Nama > Kategori/Tag > Deskripsi > Sinonim
      return nameMatch || categoryMatch || tagMatch || descMatch || synonymCategoryMatch;
    });
  };

  const filteredProducts = getFilteredProducts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-bottom-2 duration-300">
      {/* Header Pencarian */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -ml-2">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari produk digital atau fisik..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveSearch(query)}
            className="pl-9 pr-9 bg-gray-50 border-none rounded-full h-10 focus-visible:ring-primary/20"
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
            {/* Pencarian Terbaru */}
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pencarian Terbaru</h3>
                  <button onClick={clearRecent} className="text-[10px] font-bold text-red-500 uppercase">Hapus Semua</button>
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

            {/* Pencarian Populer */}
            <section>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Pencarian Populer</h3>
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
          <div className="p-4">
            {filteredProducts.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hasil Pencarian</p>
                {filteredProducts.map((product) => (
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900">Produk tidak ditemukan</h3>
                  <p className="text-[10px] text-gray-400 max-w-[200px]">Coba gunakan kata kunci lain seperti "baju", "token", atau "premium".</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
