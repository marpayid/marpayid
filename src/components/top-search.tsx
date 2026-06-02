
"use client"

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchOverlay } from './search-overlay';

export function TopSearch() {
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('marpay_cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2 shadow-sm">
        {/* Kontainer Trigger Pencarian */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="relative flex-1 flex items-center cursor-pointer group"
        >
          <Search className="absolute left-3 w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          <div className="w-full pl-9 pr-4 py-2.5 bg-gray-50 text-gray-400 text-xs md:text-sm rounded-full border-none outline-none select-none">
            Cari di MarPay
          </div>
        </div>

        <div className="flex items-center">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-gray-600 h-9 w-9 relative">
              <ShoppingBag className="w-[22px] h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-gray-600 h-9 w-9">
              <User className="w-[22px] h-[22px]" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Overlay Pencarian Profesional */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
