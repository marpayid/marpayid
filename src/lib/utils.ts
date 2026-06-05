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
 * Mendukung path lokal (/image.png) dan URL eksternal (https://...).
 */
export function getProductImage(product: any): string {
  if (!product) return '/placeholder-product.png';
  
  // Spesifik untuk kategori Premium
  if (product.category === 'Premium' || product.category?.toLowerCase() === 'premium') {
    return '/premium1.png';
  }
  
  const imgPath = product.image || '/placeholder-product.png';
  
  // Jika image adalah URL eksternal, langsung kembalikan
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  
  // Jika sudah diawali dengan "/", diasumsikan path lokal absolut dari root /public
  if (imgPath.startsWith('/')) {
    return imgPath;
  }
  
  // Jika path relatif, tambahkan "/" di depan untuk mengarah ke folder public
  return `/${imgPath}`;
}
