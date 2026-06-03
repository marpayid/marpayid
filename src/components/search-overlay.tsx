
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, X, Search, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products, Categories } from '@/app/lib/dummy-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { ProductCard } from '@/components/product-grid';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marpay_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
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

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { categories: [], products: [] };
    const matchedProducts = Products.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    const matchedCategories = Categories.filter(cat => cat.name.toLowerCase().includes(q));
    return { categories: matchedCategories, products: matchedProducts };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="w-5 h-5" /></Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari kebutuhanmu di MarPay..." 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            className="pl-9 pr-9 bg-gray-50 border-none rounded-full h-10"
          />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {query ? (
          <div className="grid grid-cols-2 gap-3">
            {results.products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 text-sm">Masukkan kata kunci pencarian</div>
        )}
      </main>
    </div>
  );
}
