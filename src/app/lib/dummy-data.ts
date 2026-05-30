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
    isFlashSale: true,
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
