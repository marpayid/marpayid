import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats the sold count based on marketplace standards.
 */
export function formatSold(count: number | string): string {
  const num = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, '')) || 0 : count;
  
  if (num < 1000) {
    return `${num} terjual`;
  } else if (num < 1000000) {
    const k = Math.floor(num / 1000);
    return `${k}rb+ terjual`;
  } else {
    const m = Math.floor(num / 1000000);
    return `${m}jt+ terjual`;
  }
}

/**
 * Mendapatkan gambar produk dengan logika kategori.
 * Semua gambar diambil dari root / folder public.
 */
export function getProductImage(product: any): string {
  if (!product) return '/placeholder-product.png';
  
  // Spesifik untuk kategori Premium
  if (product.category === 'Premium' || product.category?.toLowerCase() === 'premium') {
    return '/premium-1.png';
  }
  
  // Gunakan path image yang ada, pastikan berawalan slash
  const imgPath = product.image || '/placeholder-product.png';
  return imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
}