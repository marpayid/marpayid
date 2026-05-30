"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Kategori', icon: LayoutGrid, path: '/categories' },
    { label: 'Keranjang', icon: ShoppingCart, path: '/cart' },
    { label: 'Akun', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pb-8 pt-2 flex justify-around items-center shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.label}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-primary" : "text-gray-400"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}