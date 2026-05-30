import { PlaceHolderImages } from './placeholder-images';

export const Categories = [
  { id: 1, name: 'Gadget', icon: 'Smartphone' },
  { id: 2, name: 'Fashion', icon: 'Shirt' },
  { id: 3, name: 'Home', icon: 'Home' },
  { id: 4, name: 'Beauty', icon: 'Sparkles' },
  { id: 5, name: 'Electronic', icon: 'Laptop' },
  { id: 6, name: 'Food', icon: 'Utensils' },
  { id: 7, name: 'Travel', icon: 'Plane' },
  { id: 8, name: 'Others', icon: 'Grid' },
];

export const Products = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    price: 1299000,
    originalPrice: 1599000,
    rating: 4.8,
    reviews: 128,
    sold: 1200,
    category: 'Gadget',
    image: PlaceHolderImages.find(img => img.id === 'prod-1')?.imageUrl || 'https://picsum.photos/seed/p1/400/400',
    isFlashSale: true,
    discount: '19%',
    stock: 45
  },
  {
    id: 2,
    name: 'MarPay Smartwatch V2',
    price: 850000,
    originalPrice: 1200000,
    rating: 4.7,
    reviews: 89,
    sold: 850,
    category: 'Gadget',
    image: PlaceHolderImages.find(img => img.id === 'prod-2')?.imageUrl || 'https://picsum.photos/seed/p2/400/400',
    isFlashSale: true,
    discount: '29%',
    stock: 12
  },
  {
    id: 3,
    name: 'Air Max Runner Z',
    price: 2100000,
    rating: 4.9,
    reviews: 320,
    sold: 540,
    category: 'Fashion',
    image: PlaceHolderImages.find(img => img.id === 'prod-3')?.imageUrl || 'https://picsum.photos/seed/p3/400/400',
  },
  {
    id: 4,
    name: 'Cotton Blend Essential T-Shirt',
    price: 149000,
    rating: 4.5,
    reviews: 2100,
    sold: 5000,
    category: 'Fashion',
    image: PlaceHolderImages.find(img => img.id === 'prod-4')?.imageUrl || 'https://picsum.photos/seed/p4/400/400',
  },
  {
    id: 5,
    name: 'Automatic Espresso Maker',
    price: 3499000,
    rating: 4.6,
    reviews: 56,
    sold: 120,
    category: 'Electronic',
    image: PlaceHolderImages.find(img => img.id === 'prod-5')?.imageUrl || 'https://picsum.photos/seed/p5/400/400',
  },
  {
    id: 6,
    name: 'Classic Leather Messenger Bag',
    price: 750000,
    rating: 4.8,
    reviews: 145,
    sold: 430,
    category: 'Fashion',
    image: PlaceHolderImages.find(img => img.id === 'prod-6')?.imageUrl || 'https://picsum.photos/seed/p6/400/400',
  }
];

export const Banners = [
  { id: 1, image: PlaceHolderImages.find(img => img.id === 'banner-1')?.imageUrl || 'https://picsum.photos/seed/b1/800/400', title: 'Mega Tech Sale' },
  { id: 2, image: PlaceHolderImages.find(img => img.id === 'banner-2')?.imageUrl || 'https://picsum.photos/seed/b2/800/400', title: 'Fashion Week Specials' },
];
