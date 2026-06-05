'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Search, TrendingUp, History, X, 
  ChevronRight, LayoutGrid, Clock, SlidersHorizontal,
  PackageSearch
} from 'lucide-react';
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

// Mapping for search expansion (synonyms/related terms)
const SEARCH_EXPANSIONS: Record<string, string[]> = {
  'skincare': ['sunscreen', 'sun screen', 'serum', 'toner', 'facial wash', 'moisturizer', 'pelembab', 'cream', 'krim', 'acne', 'jerawat', 'beauty', 'kecantikan', 'perawatan wajah', 'bioaqua', 'azarine', 'wardah'],
  'beauty': ['skincare', 'kecantikan', 'sunscreen', 'serum', 'toner', 'facial wash', 'moisturizer', 'makeup', 'bodycare'],
  'pulsa': ['telkomsel', 'axis', 'xl', 'indosat', 'im3', 'tri', 'smartfren'],
  'ewallet': ['dana', 'ovo', 'gopay', 'shopeepay', 'top up saldo', 'dompet digital'],
  'e-wallet': ['dana', 'ovo', 'gopay', 'shopeepay', 'top up saldo', 'dompet digital'],
  'pln': ['token listrik', 'listrik', 'token pln'],
  'fashion': ['baju', 'kaos', 'hoodie', 'kemeja', 'celana', 'pakaian'],
  'akrilik': ['sertifikat', 'funded', 'acrylic', 'plaque'],
};

// Gender keywords defined by requirement
const FEMALE_KEYWORDS = ["wanita", "cewe", "cewek", "perempuan", "ladies", "girl", "female"];
const MALE_KEYWORDS = ["pria", "cowo", "cowok", "laki", "laki-laki", "men", "male"];
const UNISEX_KEYWORDS = ["unisex"];

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

  // Helper to detect gender from string
  const getGenderContext = (text: string) => {
    const low = text.toLowerCase();
    
    // Check Unisex first
    if (UNISEX_KEYWORDS.some(k => low.includes(k))) return 'unisex';
    
    const hasFemale = FEMALE_KEYWORDS.some(k => low.includes(k));
    const hasMale = MALE_KEYWORDS.some(k => low.includes(k));
    
    // If it mentions both without "unisex", it's complex, but for filtering we treat it as unisex
    if (hasFemale && hasMale) return 'unisex';
    if (hasFemale) return 'female';
    if (hasMale) return 'male';
    
    return 'neutral';
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
        const words = name.split(' ');
        const queryIdx = words.findIndex(w => w.includes(q));
        if (queryIdx !== -1) {
          const suggestion = words.slice(queryIdx, queryIdx + 3).join(' ');
          matches.add(suggestion);
        }
      }
      if (cat.includes(q)) matches.add(cat);
    });

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

  // Filter and sort results with expanded keyword logic and gender awareness
  const finalResults = useMemo(() => {
    if (!confirmedQuery) return [];
    const q = confirmedQuery.toLowerCase().trim();
    
    // 1. Identify Gender Preference in Query
    const queryGender = getGenderContext(q);

    // 2. Build Expansion Terms
    const baseWords = q.split(/\s+/).filter(w => w.length > 1);
    const expandedTerms = new Set<string>([q, ...baseWords]);
    
    Object.keys(SEARCH_EXPANSIONS).forEach(key => {
      if (q.includes(key)) {
        SEARCH_EXPANSIONS[key].forEach(term => expandedTerms.add(term));
      }
    });

    const searchTerms = Array.from(expandedTerms);
    
    // 3. Filter Products
    let filtered = Products.filter(p => {
      const name = p.name.toLowerCase();
      const cat = p.category?.toLowerCase() || '';
      const desc = p.description?.toLowerCase() || '';
      const content = `${name} ${cat} ${desc}`;
      
      // Strict Gender Filtering Rules:
      const productGender = getGenderContext(content);

      if (queryGender === 'female') {
        // User wants female products -> only show female or unisex. EXCLUDE strict male products.
        if (productGender === 'male') return false;
        
        // Also check if the subject matches (e.g. if searching "celana wanita", product must be related to celana)
        const nonGenderQueryWords = baseWords.filter(w => 
          !FEMALE_KEYWORDS.includes(w) && 
          !MALE_KEYWORDS.includes(w) && 
          !UNISEX_KEYWORDS.includes(w)
        );
        if (nonGenderQueryWords.length > 0) {
          const isSubjectMatch = searchTerms.some(term => {
            // Ignore gender words for subject matching
            if (FEMALE_KEYWORDS.includes(term) || MALE_KEYWORDS.includes(term)) return false;
            return content.includes(term);
          });
          if (!isSubjectMatch) return false;
        }
      } 
      else if (queryGender === 'male') {
        // User wants male products -> only show male or unisex. EXCLUDE strict female products.
        if (productGender === 'female') return false;

        const nonGenderQueryWords = baseWords.filter(w => 
          !FEMALE_KEYWORDS.includes(w) && 
          !MALE_KEYWORDS.includes(w) && 
          !UNISEX_KEYWORDS.includes(w)
        );
        if (nonGenderQueryWords.length > 0) {
          const isSubjectMatch = searchTerms.some(term => {
            if (FEMALE_KEYWORDS.includes(term) || MALE_KEYWORDS.includes(term)) return false;
            return content.includes(term);
          });
          if (!isSubjectMatch) return false;
        }
      } 
      else {
        // Broad search: must match at least one term
        const isMatch = searchTerms.some(term => content.includes(term));
        if (!isMatch) return false;
      }

      return true;
    });

    // 4. Sort and Prioritize
    const sorted = [...filtered].sort((a, b) => {
      // Prioritize gender matches if a specific gender was in query
      if (queryGender === 'female' || queryGender === 'male') {
        const aContent = `${a.name} ${a.description}`.toLowerCase();
        const bContent = `${b.name} ${b.description}`.toLowerCase();
        
        const aExplicitMatch = queryGender === 'female' 
          ? FEMALE_KEYWORDS.some(k => aContent.includes(k))
          : MALE_KEYWORDS.some(k => aContent.includes(k));
          
        const bExplicitMatch = queryGender === 'female' 
          ? FEMALE_KEYWORDS.some(k => bContent.includes(k))
          : MALE_KEYWORDS.some(k => bContent.includes(k));

        if (aExplicitMatch && !bExplicitMatch) return -1;
        if (!aExplicitMatch && bExplicitMatch) return 1;
      }

      // Default sorting modes
      switch (activeSort) {
        case 'terlaris':
          return (b.sold || 0) - (a.sold || 0);
        case 'harga_rendah':
          return a.price - b.price;
        case 'terbaru':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return sorted;
  }, [confirmedQuery, activeSort]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Search Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-50">
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
        {/* STATE 1: EMPTY INPUT */}
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

        {/* STATE 2: TEXT SUGGESTIONS */}
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

        {/* STATE 3: PRODUCT RESULTS */}
        {showResults && (
          <div className="flex flex-col bg-[#F8F9FA] pb-32">
            {/* Professional Sorting Tabs */}
            <div className="bg-white border-b border-gray-100 flex items-center sticky top-0 z-30 px-2 py-2.5 gap-1.5 overflow-x-auto no-scrollbar shadow-sm">
              {[
                { id: 'semua', label: 'Semua', icon: LayoutGrid },
                { id: 'terlaris', label: 'Terlaris', icon: TrendingUp },
                { id: 'harga_rendah', label: 'Harga', icon: SlidersHorizontal },
                { id: 'terbaru', label: 'Terbaru', icon: Clock },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveSort(opt.id as SortOption)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border",
                    activeSort === opt.id 
                      ? "bg-[#E6F6F0] text-[#008F4C] border-transparent shadow-sm" 
                      : "bg-white text-gray-400 border-gray-100"
                  )}
                >
                  <opt.icon className={cn("w-3.5 h-3.5", activeSort === opt.id ? "text-[#008F4C]" : "text-gray-300")} />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Result Info Card */}
            <div className="px-4 py-3 bg-white border-b border-gray-50">
              <div className="flex flex-col">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hasil pencarian</p>
                <h2 className="text-[13px] font-bold text-gray-800 line-clamp-1">
                  &ldquo;<span className="text-primary">{confirmedQuery}</span>&rdquo;
                </h2>
              </div>
            </div>

            <div className="flex-1">
              {finalResults.length > 0 ? (
                <div className="p-3 grid grid-cols-2 gap-3 items-start justify-items-stretch">
                  {finalResults.map((product) => (
                    <div key={product.id} className="w-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-gray-200/50">
                    <PackageSearch className="w-12 h-12 text-gray-200" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Produk tidak ditemukan</h3>
                  <p className="text-[11px] text-gray-400 mt-2 max-w-[220px] leading-relaxed">
                    Maaf, kami tidak dapat menemukan produk yang sesuai dengan &ldquo;{confirmedQuery}&rdquo;.
                  </p>
                  <Button 
                    onClick={() => { setInputValue(''); setShowResults(false); }}
                    variant="outline" 
                    className="mt-8 rounded-xl border-primary/20 text-primary font-bold h-10 px-6"
                  >
                    Coba Kata Kunci Lain
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}