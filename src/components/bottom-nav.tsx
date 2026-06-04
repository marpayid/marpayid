
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

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

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Kategori', icon: LayoutGrid, path: '/categories' },
    { label: 'Keranjang', icon: ShoppingBag, path: '/cart', hasBadge: true },
    { label: 'Akun', icon: User, path: '/profile' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-100 px-2 pt-3 flex items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)] w-full transition-all"
      style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.label}
            href={item.path}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
              isActive ? "text-primary scale-105" : "text-gray-400 hover:text-gray-500"
            )}
          >
            <div className="flex items-center justify-center h-6 w-6 relative">
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-all", 
                  isActive ? "stroke-[2.5px] fill-primary/10 text-primary" : "stroke-[1.5px]"
                )} 
              />
              {item.hasBadge && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] tracking-tight transition-colors",
              isActive ? "font-bold text-primary" : "font-medium"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
