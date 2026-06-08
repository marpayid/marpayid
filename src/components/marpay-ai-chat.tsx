"use client"

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageCircle, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function MarPayAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya Asisten AI MarPay. Ada yang bisa saya bantu terkait produk digital, fisik, atau cara pemesanan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const adminWhatsApp = "6283851278935";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    const originalInput = input.trim();
    const lowInput = originalInput.toLowerCase();
    const userMessage: Message = { role: 'user', content: originalInput };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI response logic based on expanded local FAQ
    setTimeout(() => {
      let reply = "Maaf, saya tidak menemukan jawaban yang Anda cari. Silakan hubungi admin MarPay untuk bantuan lebih lanjut melalui tombol WhatsApp di bawah.";

      // 1. Cara Pemesanan
      if (["order", "pesan", "beli", "cara beli", "cara pesan", "cara order", "langkah"].some(k => lowInput.includes(k))) {
        reply = "Untuk melakukan pemesanan, pilih produk yang Anda inginkan, klik tombol 'Beli Sekarang' atau 'Tambah ke Keranjang', lalu ikuti langkah checkout hingga pesanan berhasil dibuat.";
      }
      // 2. Metode Pembayaran
      else if (["bayar", "pembayaran", "metode", "transfer", "bank", "qris", "rekening"].some(k => lowInput.includes(k))) {
        reply = "Saat ini MarPay mendukung pembayaran melalui transfer bank, e-wallet (DANA/OVO/GoPay), QRIS, dan metode lain yang tersedia saat proses checkout.";
      }
      // 3. Batas Waktu Pembayaran
      else if (["batas waktu", "expired", "berapa lama", "kadaluarsa", "3 jam"].some(k => lowInput.includes(k))) {
        reply = "Pesanan harus dikonfirmasi dalam waktu 3 jam. Jika melewati batas waktu tersebut dan pembayaran belum diverifikasi, pesanan akan otomatis dibatalkan oleh sistem.";
      }
      // 4. Sudah Bayar Tapi Belum Update
      else if (["sudah bayar", "belum berubah", "konfirmasi bayar", "bukti bayar"].some(k => lowInput.includes(k))) {
        reply = "Jika Anda sudah melakukan pembayaran namun status belum berubah, mohon tunggu beberapa saat untuk proses verifikasi atau segera hubungi admin dengan menyertakan bukti pembayaran.";
      }
      // 5. Cek Status Pesanan
      else if (["cek status", "lihat pesanan", "perkembangan", "tracking"].some(k => lowInput.includes(k))) {
        reply = "Anda dapat melihat perkembangan pesanan Anda secara realtime dengan masuk ke menu Akun → Riwayat Pesanan.";
      }
      // 6. Originalitas
      else if (["original", "asli", "ori", "kw", "kualitas"].some(k => lowInput.includes(k))) {
        reply = "MarPay berupaya menyediakan produk berkualitas dari supplier terpercaya. Detail spesifikasi produk dapat Anda lihat pada halaman produk masing-masing.";
      }
      // 7. Gratis Ongkir
      else if (["ongkir", "gratis ongkir", "free ongkir", "biaya kirim"].some(k => lowInput.includes(k))) {
        reply = "Beberapa produk tertentu di MarPay memiliki promo gratis ongkir. Informasi ini dapat dilihat langsung pada kartu produk atau saat tahap checkout.";
      }
      // 8. Lama Pengiriman
      else if (["lama", "berapa hari", "sampai kapan", "estimasi"].some(k => lowInput.includes(k))) {
        reply = "Waktu pengiriman sangat tergantung pada lokasi alamat Anda dan jasa pengiriman (kurir) yang dipilih saat checkout.";
      }
      // 9. Pembatalan Pesanan
      else if (["batal", "cancel", "ingin batal"].some(k => lowInput.includes(k))) {
        reply = "Pesanan yang belum diproses oleh admin dapat diajukan pembatalan dengan cara menghubungi admin melalui chat WhatsApp.";
      }
      // 10. Produk Tidak Sesuai
      else if (["tidak sesuai", "salah", "rusak", "cacat", "komplain", "unboxing"].some(k => lowInput.includes(k))) {
        reply = "Jika produk yang diterima tidak sesuai, segera hubungi admin dan pastikan menyertakan foto serta video unboxing produk untuk proses pengecekan lebih lanjut.";
      }
      // 11. COD
      else if (["cod", "bayar ditempat", "bayar di tempat"].some(k => lowInput.includes(k))) {
        reply = "Layanan COD tersedia pada produk-produk tertentu sesuai dengan kebijakan penjual dan ketersediaan layanan pengiriman di wilayah Anda.";
      }
      // 12. Voucher
      else if (["voucher", "kupon", "kode promo", "diskon"].some(k => lowInput.includes(k))) {
        reply = "Anda dapat menggunakan voucher dengan memasukkan kode voucher pada kolom yang tersedia saat checkout jika terdapat promo yang sedang berlaku.";
      }
      // 13. Keamanan Data
      else if (["aman", "data pribadi", "privasi", "terpercaya"].some(k => lowInput.includes(k))) {
        reply = "MarPay berkomitmen menjaga keamanan data pelanggan dengan sangat ketat dan tidak akan membagikan informasi pribadi Anda kepada pihak lain tanpa izin.";
      }
      // 14. Hubungi Admin
      else if (["admin", "hubungi", "wa", "whatsapp", "kontak", "cs", "customer service"].some(k => lowInput.includes(k))) {
        reply = "Anda dapat menghubungi admin dengan klik tombol WhatsApp atau melalui menu 'Pusat Bantuan' yang tersedia di halaman akun.";
      }
      // 15. Luar Kota
      else if (["luar kota", "daerah", "wilayah", "kirim ke"].some(k => lowInput.includes(k))) {
        reply = "Ya, MarPay melayani pengiriman ke berbagai wilayah di seluruh Indonesia yang didukung oleh jaringan jasa ekspedisi mitra kami.";
      }
      // 16. Lacak Resi
      else if (["resi", "lacak", "nomor resi"].some(k => lowInput.includes(k))) {
        reply = "Nomor resi akan tersedia setelah pesanan dikirim oleh kurir. Anda bisa melihatnya langsung pada bagian 'Detail Pesanan' di menu riwayat transaksi.";
      }
      // 17. Produk Digital
      else if (["digital", "otomatis", "proses digital"].some(k => lowInput.includes(k))) {
        reply = "Produk digital diproses sesuai jenisnya. Beberapa layanan seperti top up seringkali dikirim lebih cepat dibandingkan produk fisik.";
      }
      // 18. Top Up & PPOB
      else if (["game", "top up", "pulsa", "pln", "e-wallet", "ppob"].some(k => lowInput.includes(k))) {
        reply = "Ya, MarPay menyediakan berbagai layanan digital lengkap seperti top up game favorit, isi pulsa, paket data, saldo e-wallet, token PLN, dan layanan tagihan lainnya.";
      }
      // 19. Sapaan Umum
      else if (["hi", "hai", "halo", "hallo", "p"].some(k => lowInput === k)) {
        reply = "Halo! Saya CS AI MarPay. Ada yang bisa saya bantu terkait cara pemesanan, pembayaran, atau bantuan lainnya?";
      }
      // 20. Terima Kasih
      else if (["makasih", "terima kasih", "thanks", "oke"].some(k => lowInput.includes(k))) {
        reply = "Sama-sama! Senang bisa membantu Anda. Jika butuh bantuan lagi, jangan ragu untuk bertanya.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setIsLoading(false);
    }, 800);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent('Halo Admin MarPay, saya butuh bantuan terkait pesanan saya...')}`, '_blank');
  };

  return (
    <>
      {/* AI Card in Account Page */}
      <div className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] opacity-[0.03]">
          <Bot className="w-24 h-24 rotate-12" />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">Asisten MarPay</h4>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed relative z-10">
          Tanya seputar pesanan, produk, PPOB, dan cara order secara instan dengan bantuan asisten otomatis.
        </p>

        <Button 
          onClick={() => setIsOpen(true)} 
          className="w-full bg-primary text-white font-bold h-11 rounded-xl text-xs shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Mulai Chat
        </Button>
      </div>

      {/* Chat Popup / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="mt-auto bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-full"
            style={{ height: '85vh', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">CS AI MarPay</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Asisten Virtual</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/30 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-[22px] text-[13px] leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2 text-gray-400 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Asisten Mengetik...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="bg-white p-5 space-y-4 border-t border-gray-50">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase py-3 rounded-xl border border-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition-all mb-1"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi Admin WhatsApp
              </button>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik pertanyaan (cara order, bayar, dll...)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading} 
                  size="icon" 
                  className="rounded-2xl h-12 w-12 bg-primary text-white shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
