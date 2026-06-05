export const Categories = [
  { id: 1, name: 'Top Up', icon: 'Zap' },
  { id: 2, name: 'Kecantikan', icon: 'Flower2' },
  { id: 3, name: 'Fashion', icon: 'Shirt' },
  { id: 4, name: 'Elektronik', icon: 'Smartphone' },
  { id: 9, name: 'Aksesoris hp', icon: 'Smartphone' },
  { id: 5, name: 'Game', icon: 'Gamepad2' },
  { id: 6, name: 'Voucher', icon: 'Ticket' },
  { id: 7, name: 'E-Wallet', icon: 'Wallet' },
  { id: 8, name: 'Premium', icon: 'Crown' },
];

export const Vouchers = [
  {
    id: 101,
    title: 'GRATIS ONGKIR MARPAY',
    description: 'Nikmati gratis ongkir untuk pembelian produk fisik di MarPay.',
    benefit: 'Potongan Rp15rb',
    minSpend: 'Min. blj Rp50rb',
    expiry: '30 Jun 2026',
    expiryDate: '2026-06-30',
    code: 'ONGKIRMARPAY',
    type: 'shipping',
    icon: 'Truck',
    active: true,
    info: 'Min. blj Rp50.000',
    badge: '🚚 Gratis Ongkir',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/10'
  },
  {
    id: 102,
    title: 'NEW USER SPECIAL',
    description: 'Diskon 10% untuk seluruh pengguna baru MarPay.',
    benefit: 'Diskon 10%',
    minSpend: 'Tanpa Min. Belanja',
    expiry: '31 Des 2026',
    expiryDate: '2026-12-31',
    code: 'MARPAYBARU',
    type: 'discount',
    icon: 'Ticket',
    active: true,
    info: 'Berlaku 1x',
    badge: '🎟️ New User',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100'
  }
];

export const Products = [
  {
    id: 206,
    name: 'BETTERHALF Celana Pendek Pria Polos Short Pants Boardshort - Black',
    price: 47320,
    originalPrice: 86000,
    rating: 4.9,
    reviews: '6.2rb+',
    sold: 10000,
    category: 'Fashion',
    image: '/celana1.png',
    isFlashSale: true,
    discount: '45%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['M', 'L', 'XL'],
    shippingFee: 12000,
    description: `BETTERHALF Celana Pendek Cowo Polos Short Pants Boardshort - Black

Material :
* ﻿﻿Parasut
* ﻿﻿Tali Serut
* ﻿﻿Karet Pinggang

Info Pengiriman :
* ﻿﻿Pengiriman setiap hari pukul 13.00 WIB. (Hari minggu
* libur / tidak ada pengiriman)
* ﻿﻿Mohon selesaikan pembayaran sebelum jam 13.00 akan diproses hari yang sama.

Kebijakan Pembeli :
* ﻿﻿Memastikan ukuran sebelum melakukan pembayaran.
* ﻿﻿Untuk detail ukuran produk silahkan cek di table ukuran yang tersedia.
* ﻿﻿Pesanan yang sudah masuk tidak dapat dibatalkan.
* ﻿﻿Pastikan alamat sudah sesuai, karena pesanan yang sudah masuk tidak bisa diubah kembali.

Kebijakan Pengembalian :
* ﻿﻿Tidak menerima penukaran size, dimohon untuk memastikan ukuran produk sebelum transaksi.
* ﻿﻿Hanya menerima penukaran produk yang terdapat kerusakan, cacat dan salah pengiriman dengan menyertakan video unboxing.

Terima kasih.`,
  },
  {
    id: 205,
    name: 'Kemeja Wanita Salur Alba Top – Stripe Fitted Shirt Slim Fit Lengan Pendek Casual Kantor Korean Style',
    price: 59999,
    originalPrice: 89000,
    rating: 4.9,
    reviews: '630',
    sold: 8000,
    category: 'Fashion',
    image: '/fitted2.png',
    isFlashSale: true,
    discount: '33%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['S-M', 'L-XL'],
    colors: ['Hitam🔥', 'Grey', 'Putih', 'Maroon', 'Mahogany', 'Navy'],
    shippingFee: 0,
    description: `Alba Top Kemeja Wanita Salur dengan desain Stripe Fitted Shirt Slim Fit. Model casual cocok untuk kantor maupun gaya Korean Style. Bahan premium yang nyaman dan tidak menerawang, memberikan kesan ramping (press body) yang tetap elegan.`,
  },
  {
    id: 201,
    name: 'Case iPhone Clear MagSafe Premium Anti Shock Transparan',
    price: 14899,
    originalPrice: 24999,
    rating: 4.9,
    reviews: '1.2rb',
    sold: 10500,
    category: 'Aksesoris hp',
    image: '/case1.png',
    isFlashSale: true,
    discount: '40%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    hasPriceRange: true,
    variants: [
      'iPhone 7/8', 'iPhone 7+/8+', 'iPhone X/XS', 'iPhone XR', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
      'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 17', 'iPhone 17 Air', 'iPhone 17 Pro', 'iPhone 17 Pro Max'
    ],
    shippingFee: 0,
    forceFreeShippingLabel: true,
    description: `Case iPhone Clear MagSafe Premium dengan desain transparan elegan dan perlindungan maksimal.`
  },
  {
    id: 202,
    name: 'Case iPhone Street Art Premium',
    price: 23999,
    originalPrice: 49999,
    rating: 4.9,
    reviews: '1.5rb',
    sold: 10000,
    category: 'Aksesoris hp',
    image: '/case2.png',
    isFlashSale: true,
    discount: '52%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: [
      'iPhone 7/8', 'iPhone 7+/8+', 'iPhone X/XS', 'iPhone XR', 'iPhone XS Max',
      'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
      'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
      'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
      'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'
    ],
    shippingFee: 0,
    forceFreeShippingLabel: true,
    description: `Case iPhone Street Art Premium dengan desain grafiti modern.`
  },
  {
    id: 203,
    name: 'Everyday Pants - Stripe Pants - Celana Panjang Wanita Baggy Kantor Kuliah Motif Garis Kulot Pinstripe',
    price: 59252,
    originalPrice: 85000,
    rating: 4.8,
    reviews: '2.7rb',
    sold: 10000,
    category: 'Fashion',
    image: '/baggy1.png',
    isFlashSale: true,
    discount: '30%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    hasPriceRange: true,
    variants: ['Standar (BB 35-55Kg)', 'Jumbo (BB 56-70Kg)', 'Super Jumbo (BB 71-85Kg)'],
    colors: ['Abu Grey', 'Hitam', 'Putih', 'Navi', 'Mahogani', 'Khaki', 'Ice Blue'],
    shippingFee: 0,
    description: `Everyday Stripe Pants merupakan celana wanita model baggy kulot premium dengan motif garis pinstripe yang cocok digunakan untuk kuliah, kerja, kantor, jalan-jalan, maupun aktivitas sehari-hari. Menggunakan bahan yang nyaman, adem, tidak menerawang, dan memiliki potongan loose fit sehingga tetap stylish digunakan sepanjang hari.`,
  },
  {
    id: 204,
    name: 'Kemeja Wanita Fitted Luna Stripe Atasan Salur Korean Style Terbaru',
    price: 59000,
    originalPrice: 89000,
    rating: 4.9,
    reviews: '154',
    sold: 1200,
    category: 'Fashion',
    image: '/fitted1.png',
    isFlashSale: true,
    discount: '34%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['M', 'L', 'XL'],
    colors: ['Choco Stripe'],
    shippingFee: 0,
    description: `Luna Stipe Kemeja Fitted
bahan SemiWoll Stripe
Bagian belakang terdapat tali sabuk bisa di adjust untuk
menyesuaikan bentuk tubuh / slimfit ( press body)
Model fitted slimfit yang menyesuaikan bentuk tubuh Lengan panjang yang cocok untuk acara formal maupun
santai

Detail Ukuran
(M-L)
Lingkar Dada 100cm
Panjang Baju 60cm
Panjang Lengan -+ 55cm
(XL)
Lingkar Dada 110 cm
Panjang Baju 65cm
Panjang Lengan -+ 55cm

Note : Warna yg agak sedikit berbeda karena efek
cahaya
Toleransi ukuran 1-2 cm karena proses jahit`,
  },
  {
    id: 3,
    name: 'Wispie Money Magnet Fitted Shirt | Kemeja Kerja Wanita Press Body Pinstripe Salur Pink',
    price: 132000,
    originalPrice: 176000,
    rating: 4.9,
    reviews: '4.7rb',
    sold: 10000,
    category: 'Fashion',
    image: '/wispie1.png',
    isFlashSale: true,
    discount: '25%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    shippingFee: 12000,
    description: `Kemeja wanita premium dengan desain fitted body.`
  },
  {
    id: 2,
    name: 'Akrilik Sertifikat Funded - Custom Payout Certificate Premium',
    price: 269000,
    originalPrice: 350000,
    rating: 5.0,
    reviews: '84',
    sold: 84,
    category: 'Sertifikat Funded',
    image: '/aklik1.png',
    isFlashSale: false,
    discount: '23%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    hasPriceRange: true,
    variants: ['20x10', '20x15'],
    shippingFee: 20000,
    description: `Akrilik Sertifikat Funded premium cocok untuk trader.`,
  },
  {
    id: 6,
    name: 'BRTWL Hoodie Boxy | Hoodie Oversize Unisex Fleece Cotton - Mercy Series',
    price: 203230,
    originalPrice: 259000,
    rating: 4.8,
    reviews: '438',
    sold: 3200,
    category: 'Fashion',
    image: '/hoodie1.png',
    isFlashSale: true,
    discount: '22%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['M', 'L', 'XL'],
    shippingFee: 8000,
    description: `Hoodie boxy oversize unisex berbahan fleece cotton.`
  },
  {
    id: 1,
    name: 'BIOAQUA Skincare 1 Set Lengkap 6pcs With Brightening Serum Wajah',
    price: 140000,
    originalPrice: 200000,
    rating: 4.9,
    reviews: '1.2rb',
    sold: 10500,
    category: 'Kecantikan',
    image: '/bioaqua24k.png',
    isFlashSale: true,
    discount: '30%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['Whitening Set 6Pcs', 'Anti-Acne Set 6Pcs'],
    shippingFee: 15000,
    description: `BIOAQUA Skincare Set Lengkap 6Pcs.`
  },
  {
    id: 207,
    name: 'Azarine Calm My Acne Sunscreen Moisturiser SPF35 PA+++ [LOLOS UJI INVIVO INVITRO] Chemical Sunscreen Gel Untuk Kulit Berminyak Berjerawat Sensitif 40ml',
    price: 47000,
    originalPrice: 59000,
    rating: 4.9,
    reviews: '7.8rb+',
    sold: 10000,
    category: 'Kecantikan',
    image: '/azarine1.png',
    isFlashSale: true,
    discount: '20%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    shippingFee: 0,
    description: 'Sunscreen gel (chemical sunscreen) yang ringan dan dingin di kulit, diformulasikan khusus untuk kulit berminyak, berjerawat, dan sensitif. Mengandung Anti-Acne Active untuk menenangkan kulit dan mengontrol sebum berlebih.',
  },
  {
    id: 208,
    name: 'Wardah UV Shield Acne Calming Sunscreen Serum SPF 50 PA++++',
    price: 28000,
    originalPrice: 49900,
    rating: 4.9,
    reviews: '10rb+',
    sold: 50000,
    category: 'Kecantikan',
    image: '/wardah1.png',
    isFlashSale: true,
    discount: '44%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    hasPriceRange: true,
    variants: ['Acne Calming SPF50 25ml', 'Acne Calming SPF35 35ml', 'Acne Calming SPF50 40ml'],
    shippingFee: 8000,
    description: `Wardah UV Shield Acne Calming Sunscreen Serum SPF 50 PA++++ merupakan sunscreen serum dengan perlindungan tinggi yang diformulasikan khusus untuk kulit berminyak dan rentan berjerawat. Membantu melindungi kulit dari sinar UVA, UVB, blue light, dan polusi sekaligus memberikan efek menenangkan pada kulit.

Keunggulan:
• SPF 50 PA++++
• Ringan dan cepat meresap
• No White Cast
• Non Comedogenic
• Non Acnegenic
• Cocok untuk kulit berminyak dan berjerawat
• Membantu menjaga skin barrier
• Nyaman digunakan sehari-hari`,
  },
  {
    id: 101,
    name: 'Canva Pro - Akun Premium Aktif 1 Bulan Full Garansi',
    price: 12000,
    rating: 4.9,
    reviews: '2.1rb',
    sold: 3500,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Best Seller',
    description: 'Nikmati fitur premium Canva Pro untuk desain profesional tanpa batas.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 102,
    name: 'Spotify Premium - Akun Private / Family 1 Bulan Full Garansi',
    price: 15000,
    rating: 4.9,
    reviews: '4.8rb',
    sold: 8200,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Best Seller',
    description: 'Musik tanpa iklan, download lagu, dan kualitas suara terbaik dengan Spotify Premium.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 103,
    name: 'YouTube Premium - Akun Private 1 Bulan Bebas Iklan',
    price: 10000,
    rating: 4.8,
    reviews: '3.2rb',
    sold: 6500,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Best Seller',
    description: 'Nonton video tanpa gangguan iklan, putar di latar belakang, dan YouTube Music Premium.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 104,
    name: 'Netflix Premium - Sharing / Private Profile 4K UHD 1 Bulan',
    price: 35000,
    rating: 4.7,
    reviews: '1.9rb',
    sold: 4200,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Recommended',
    description: 'Streaming film dan series kualitas 4K Ultra HD dengan akun Netflix Premium.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 105,
    name: 'CapCut Pro - Akun Premium Aktif 1 Bulan Full Fitur',
    price: 15000,
    rating: 4.9,
    reviews: '950',
    sold: 2100,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Best Seller',
    description: 'Akses semua fitur editing pro, transisi, dan efek eksklusif di CapCut.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 106,
    name: 'ChatGPT Plus - Akses GPT-4 & DALL-E 3 Shared 1 Bulan',
    price: 45000,
    rating: 4.9,
    reviews: '150',
    sold: 500,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Hot Item',
    description: 'Gunakan kecerdasan AI terbaru GPT-4 dengan ChatGPT Plus premium.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 107,
    name: 'Vidio Premier Platinum - Akun 1 Bulan Full Garansi',
    price: 15000,
    rating: 4.8,
    reviews: '420',
    sold: 1200,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Recommended',
    description: 'Nonton bola, drama korea, dan konten eksklusif lainnya di Vidio.',
    type: 'digital',
    shippingFee: 0
  },
  {
    id: 108,
    name: 'Alight Motion Premium - Akun Full Fitur No Watermark 1 Bulan',
    price: 12000,
    rating: 4.9,
    reviews: '310',
    sold: 850,
    category: 'Premium',
    image: '/premium1.png',
    stock: 'Tersedia',
    tag: 'Best Seller',
    description: 'Edit motion graphic tanpa watermark dengan Alight Motion Premium.',
    type: 'digital',
    shippingFee: 0
  }
];

export const Banners = [
  {
    id: 1,
    title: 'Semua Kebutuhan Digital Dalam Satu Tempat',
    subtitle: 'Pulsa, Paket Data, Token PLN, E-Wallet, Top Up Game, BPJS dan Tagihan Internet',
    badges: ['PROSES INSTAN', 'AMAN & TERPERCAYA', '24 JAM NONSTOP'],
    type: 'digital',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700'
  },
  {
    id: 2,
    title: 'Belanja Lebih Hemat Setiap Hari',
    subtitle: 'Gratis ongkir, promo spesial, produk pilihan dan pengiriman cepat',
    badges: ['GRATIS ONGKIR', 'PROMO SPESIAL', 'PRODUK PILIHAN'],
    type: 'physical',
    gradient: 'from-emerald-500 via-teal-600 to-blue-600'
  }
];
