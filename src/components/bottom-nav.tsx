
"use client"

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
      className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-100 flex items-center shadow-[0_-4px_15px_rgba(0,0,0,0.05)] w-full transition-all"
      style={{ 
        height: 'calc(58px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
      }}
    >
      <div className="flex items-center w-full h-[58px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-105" : "text-gray-400"
              )}
            >
              <div className="flex items-center justify-center h-6 w-6 relative">
                <item.icon 
                  className={cn(
                    "w-[22px] h-[22px] transition-all", 
                    isActive ? "stroke-[2.5px] fill-primary/10 text-primary" : "stroke-[1.8px]"
                  )} 
                />
                {item.hasBadge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[9px] tracking-tight transition-colors",
                isActive ? "font-bold text-primary" : "font-medium"
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
