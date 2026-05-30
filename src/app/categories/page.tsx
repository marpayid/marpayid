
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Categories } from '@/app/lib/dummy-data';
import * as Icons from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

export default function CategoriesPage() {
  const router = useRouter();

  const handleCategoryClick = (catName: string) => {
    // Redirect digital categories to PPOB page
    const digitalCategories = ['Top Up', 'E-Wallet', 'Voucher', 'Premium'];
    if (digitalCategories.includes(catName)) {
      router.push('/ppob');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Semua Kategori</h1>
      </header>

      <main className="pt-20 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-y divide-gray-100">
            {Categories.map((cat) => {
              const LucideIcon = (Icons as any)[cat.icon];
              return (
                <div 
                  key={cat.id} 
                  className="flex flex-col items-center justify-center p-6 gap-3 active:bg-gray-50 cursor-pointer text-center group"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-active:scale-95 transition-transform">
                    {LucideIcon && <LucideIcon className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-md font-bold text-gray-900">Populer Hari Ini</h2>
          <div className="grid grid-cols-2 gap-3">
            {['BIOAQUA', 'Sertifikat', 'Custom Akrilik', 'Skincare Viral'].map(tag => (
              <div key={tag} className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex items-center justify-between active:bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium">{tag}</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
