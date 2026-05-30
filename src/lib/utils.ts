import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats the sold count based on marketplace standards.
 * - Below 1,000: Exact number (e.g., "84 terjual")
 * - 1,000 to 999,999: Thousands with "+" (e.g., "1rb+ terjual")
 * - 1,000,000 and above: Millions with "+" (e.g., "1jt+ terjual")
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
