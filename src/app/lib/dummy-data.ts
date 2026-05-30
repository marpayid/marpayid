import { PlaceHolderImages } from './placeholder-images';

export const Categories = [
  { id: 1, name: 'Game', icon: 'Gamepad2' },
  { id: 2, name: 'Pulsa', icon: 'Smartphone' },
  { id: 3, name: 'PPOB', icon: 'Zap' },
  { id: 4, name: 'Voucher', icon: 'Ticket' },
  { id: 5, name: 'Premium', icon: 'Crown' },
  { id: 6, name: 'E-Wallet', icon: 'Wallet' },
  { id: 7, name: 'Streaming', icon: 'Tv' },
  { id: 8, name: 'Lainnya', icon: 'LayoutGrid' },
];

export const Products = [
  {
    id: 1,
    name: 'Top Up Mobile Legends - 170 Diamonds',
    price: 45000,
    originalPrice: 55000,
    rating: 4.9,
    reviews: 1240,
    sold: 15000,
    category: 'Game',
    image: 'https://picsum.photos/seed/mlbb/400/400',
    isFlashSale: true,
    discount: '18%',
    stock: 85,
    tag: 'Produk Viral'
  },
  {
    id: 2,
    name: 'Netflix Premium 1 Bulan - Shared Account',
    price: 25000,
    originalPrice: 35000,
    rating: 4.8,
    reviews: 890,
    sold: 5200,
    category: 'Premium',
    image: 'https://picsum.photos/seed/netflix/400/400',
    isFlashSale: true,
    discount: '28%',
    stock: 12,
    tag: 'Produk Viral'
  },
  {
    id: 3,
    name: 'Pulsa Telkomsel 50.000',
    price: 51000,
    rating: 4.9,
    reviews: 5400,
    sold: 25000,
    category: 'Pulsa',
    image: 'https://picsum.photos/seed/tsel/400/400',
  },
  {
    id: 4,
    name: 'Top Up Free Fire - 355 Diamonds',
    price: 50000,
    originalPrice: 65000,
    rating: 4.7,
    reviews: 2100,
    sold: 12000,
    category: 'Game',
    image: 'https://picsum.photos/seed/ff/400/400',
    tag: 'Produk Viral'
  },
  {
    id: 5,
    name: 'Token PLN 100.000',
    price: 101500,
    rating: 4.9,
    reviews: 3200,
    sold: 8000,
    category: 'PPOB',
    image: 'https://picsum.photos/seed/pln/400/400',
  },
  {
    id: 6,
    name: 'Spotify Premium 1 Bulan - Individual',
    price: 35000,
    rating: 4.8,
    reviews: 1450,
    sold: 4300,
    category: 'Premium',
    image: 'https://picsum.photos/seed/spotify/400/400',
    tag: 'Produk Viral'
  },
  {
    id: 7,
    name: 'Gojek/GoPay Top Up 100k',
    price: 101000,
    rating: 4.9,
    reviews: 1200,
    sold: 3000,
    category: 'E-Wallet',
    image: 'https://picsum.photos/seed/gopay/400/400',
  },
  {
    id: 8,
    name: 'Voucher Google Play 50.000',
    price: 52000,
    rating: 4.7,
    reviews: 800,
    sold: 1500,
    category: 'Voucher',
    image: 'https://picsum.photos/seed/googleplay/400/400',
  }
];

export const Banners = [
  { id: 1, image: 'https://picsum.photos/seed/marpay1/800/400', title: 'Top Up Game Termurah!' },
  { id: 2, image: 'https://picsum.photos/seed/marpay2/800/400', title: 'Promo PPOB Setiap Hari' },
];