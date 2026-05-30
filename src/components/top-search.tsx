"use client"

import { Search, ShoppingCart, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TopSearch() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Cari di MarPay" 
          className="pl-9 bg-gray-50 border-none rounded-lg h-10 focus-visible:ring-primary/20 text-sm placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative text-gray-700 h-9 w-9 p-0">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-gray-700 h-9 w-9 p-0">
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}