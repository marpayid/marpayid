'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Products } from '@/app/lib/dummy-data';
import { ProductCard } from '@/components/product-grid';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus otomatis saat dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Logika Pencarian
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Jika input kosong, tampilkan produk viral/rekomendasi
    if (!q) {
      return Products.filter(p => p.tag === 'Produk Viral').slice(0, 8);
    }
    
    // Filter produk berdasarkan nama, kategori, atau deskripsi
    return Products.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      return nameMatch || categoryMatch || descMatch;
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-200">
      {/* Search Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setQuery('');
            onClose();
          }}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            ref={inputRef}
            placeholder="Cari kebutuhanmu di MarPay..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 bg-gray-50 border-none rounded-full h-11 focus-visible:ring-primary/20 text-sm"
          />
        </div>
      </header>

      {/* Search Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 pb-10">
        {/* Label Kondisional */}
        <div className="flex items-center gap-2 mb-4 px-1">
          {!query ? (
            <>
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Rekomendasi Untukmu</h2>
            </>
          ) : (
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">
              Hasil Pencarian: <span className="text-primary">"{query}"</span>
            </h2>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-40">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Produk tidak ditemukan</p>
              <p className="text-[11px] font-medium text-gray-500 mt-1">Coba gunakan kata kunci lain</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}