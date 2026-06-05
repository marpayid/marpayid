
"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
      className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.06)] w-full"
      style={{ 
        paddingBottom: 'calc(4px + env(safe-area-inset-bottom))' 
      }}
    >
      <div className="flex items-center w-full h-[56px] px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 h-full",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <div className="flex items-center justify-center h-6 w-6 relative">
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-all", 
                    isActive ? "stroke-[2.5px] fill-primary/10 text-primary" : "stroke-[1.8px]"
                  )} 
                />
                {item.hasBadge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[7px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[9.5px] tracking-tight leading-none font-bold uppercase",
                isActive ? "text-primary" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
