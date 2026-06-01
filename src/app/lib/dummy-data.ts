export const Categories = [
  { id: 1, name: 'Top Up', icon: 'Zap' },
  { id: 2, name: 'Skincare', icon: 'Sparkles' },
  { id: 3, name: 'Fashion', icon: 'Shirt' },
  { id: 4, name: 'Elektronik', icon: 'Smartphone' },
  { id: 5, name: 'Hobi', icon: 'Gamepad2' },
  { id: 6, name: 'Voucher', icon: 'Ticket' },
  { id: 7, name: 'E-Wallet', icon: 'Wallet' },
  { id: 8, name: 'Premium', icon: 'Crown' },
];

export const Products = [
  {
    id: 1,
    name: 'BIOAQUA Skincare 1 Set Lengkap 6pcs With Brightening Serum Wajah / Acne Essence / Day & Night Pelembab Wajah Cream Krim / Hydrating Toner Wajah / Facial Wash Sabun Cuci Muka Skincare Paket',
    price: 140000,
    originalPrice: 200000,
    rating: 4.9,
    reviews: '1.2rb',
    sold: 10500,
    category: 'Skincare',
    image: '/bioaqua24k.png',
    isFlashSale: true,
    discount: '30%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['Whitening Set 6Pcs', 'Anti-Acne Set 6Pcs'],
    description: `BIOAQUA Skincare Set Lengkap 6Pcs hadir sebagai solusi perawatan wajah harian dengan rangkaian produk yang saling melengkapi untuk membantu menjaga kelembapan, kebersihan, dan tampilan kulit agar terlihat lebih sehat dan terawat.

Isi Paket:
• Facial Wash
• Hydrating Toner
• Brightening Serum / Acne Essence
• Day Cream
• Night Cream
• Perawatan pendukung lainnya sesuai varian

Keunggulan:
• Membantu menjaga kelembapan kulit
• Membersihkan wajah dari kotoran dan minyak berlebih
• Cocok digunakan pagi dan malam hari
• Praktis dalam satu paket lengkap
• Kemasan premium dan aman digunakan sehari-hari

Varian:
1. Whitening Set 6Pcs
Membantu membuat kulit tampak lebih cerah dan segar.

2. Anti-Acne Set 6Pcs
Membantu merawat kulit berjerawat dan menjaga kondisi kulit tetap nyaman.`
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
    image: '/akrilik1.png',
    isFlashSale: false,
    discount: '23%',
    stock: 'Tersedia',
    tag: 'Eksklusif',
    variants: ['20x10', '20x15'],
    description: `Akrilik Sertifikat Funded premium cocok untuk pajangan meja, hadiah trader, dokumentasi payout, dan koleksi pencapaian funded account. Menggunakan bahan akrilik tebal 2cm dengan tampilan elegan, jernih, dan eksklusif.

Keunggulan:
• Bahan akrilik premium tebal 2cm
• Tampilan elegan dan profesional
• Cocok untuk pajangan meja
• Bisa custom nama, payout, tanggal, dan desain sertifikat
• Cocok untuk trader, prop firm, dan hadiah pencapaian`
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
    stock: 50,
    tag: 'Produk Viral',
    variants: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: `Wispie Money Magnet Fitted Shirt
Kemeja wanita premium dengan desain fitted body yang memberikan tampilan lebih elegan, rapi, dan profesional. Motif pinstripe salur membuat penampilan terlihat lebih modern serta cocok digunakan untuk berbagai aktivitas sehari-hari.

Keunggulan Produk:
• Warna Pink eksklusif
• Model fitted / press body
• Motif pinstripe salur premium
• Nyaman dipakai seharian
• Bahan lembut dan tidak panas
• Jahitan rapi dan berkualitas
• Cocok untuk kerja, kuliah, meeting, kantor, maupun acara formal
• Mudah dipadukan dengan rok maupun celana

📏 Tersedia Ukuran:
S, M, L, XL, 2XL, 3XL

📦 Informasi:
• Produk fisik
• Diproses setelah pembayaran terverifikasi
• Cocok untuk aktivitas formal maupun kasual`
  },
  {
    id: 4,
    name: 'Rephatious T-shirt "Rpts412" Black Cotton Combed 24s',
    price: 76000,
    originalPrice: 95000,
    rating: 4.8,
    reviews: '124',
    sold: 450,
    category: 'Fashion',
    image: '/rephatious1.png',
    isFlashSale: false,
    discount: '20%',
    stock: 'Tersedia',
    tag: 'Produk Viral',
    variants: ['M', 'L', 'XL'],
    description: `Kaos Rephatious Rpts412 berbahan Cotton Combed 24s yang nyaman, adem, dan cocok digunakan sehari-hari. Material berkualitas dengan desain simpel dan modern.

Spesifikasi:
- Brand: Rephatious
- Model: Rpts412
- Bahan: Cotton Combed 24s
- Warna: Hitam
- Ukuran: M, L, XL
- Kondisi: Baru`
  }
];

export const Banners = [
  {
    id: 1,
    title: 'Semua Kebutuhan Digital Dalam Satu Tempat',
    subtitle: 'Pulsa, Paket Data, Token PLN, E-Wallet, Top Up Game, BPJS dan Tagihan Internet',
    badges: ['Proses Instan', 'Aman & Terpercaya', '24 Jam Nonstop'],
    type: 'digital',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700'
  },
  {
    id: 2,
    title: 'Belanja Lebih Hemat Setiap Hari',
    subtitle: 'Gratis ongkir, promo spesial, produk pilihan dan pengiriman cepat',
    badges: ['Gratis Ongkir', 'Promo Spesial', 'Produk Pilihan'],
    type: 'physical',
    gradient: 'from-emerald-500 via-teal-600 to-blue-600'
  }
];
