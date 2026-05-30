"use client"

import { Search, Bell, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TopSearch() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center gap-3">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Cari di MarPay..." 
          className="pl-9 bg-gray-50 border-none rounded-full h-10 focus-visible:ring-primary/20"
        />
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">3</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}