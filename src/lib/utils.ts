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
 * Formats the reviews count to compact Indonesian style (e.g. 1,2rb).
 */
export function formatReviews(count: number | string): string {
  const num = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, '')) || 0 : count;
  
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    const val = num / 1000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',');
    return `${formatted}rb`;
  } else {
    const val = num / 1000000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',');
    return `${formatted}jt`;
  }
}

/**
 * Mendapatkan gambar produk dengan logika kategori.
 * Mendukung field productImage (normalized), image (saved in order), dan imageUrl (external).
 */
export function getProductImage(product: any): string {
  const DEFAULT_PLACEHOLDER = 'https://placehold.co/600x600?text=MarPay+Product';
  
  if (!product) return DEFAULT_PLACEHOLDER;
  
  // Spesifik untuk kategori Premium
  if (product.category === 'Premium' || product.category?.toLowerCase() === 'premium') {
    return '/premium1.png';
  }
  
  // Prioritas field: productImage (normalized) -> image (order data) -> imageUrl (external) -> image (local)
  const imgPath = product.productImage || product.image || product.imageUrl || '';
  
  if (!imgPath) {
    return DEFAULT_PLACEHOLDER;
  }

  // Jika image adalah URL eksternal (http/https), langsung kembalikan
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
