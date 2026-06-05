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

    // Simulated "AI" response logic based on expanded local FAQ keywords
    setTimeout(() => {
      let reply = "Maaf, CS AI MarPay belum memahami pertanyaan itu. Silakan tanya tentang order, pembayaran, pulsa, e-wallet, PLN, produk, stok, pengiriman, atau hubungi admin WhatsApp.";

      // 1. Sapaan
      if (["hi", "hai", "halo", "hallo", "p", "tes", "assalamualaikum", "permisi"].some(k => lowInput === k || lowInput.startsWith(k + " "))) {
        reply = "Halo! Saya CS AI MarPay. Silakan tanya tentang cara order, pembayaran, pulsa, e-wallet, PLN, produk, pengiriman, atau bantuan lainnya.";
      } 
      // 2. Cara order / pesan
      else if (["order", "pesan", "beli", "cara beli", "cara pesan", "cara order", "checkout", "co", "mau beli", "mau order"].some(k => lowInput.includes(k))) {
        reply = "Untuk order di MarPay, pilih produk yang diinginkan, tekan beli/checkout, lalu kirim pesanan ke WhatsApp admin untuk konfirmasi.";
      }
      // 3. Cara bayar
      else if (["bayar", "pembayaran", "metode bayar", "transfer", "qris", "qr", "dana bayar", "rekening", "bank", "e-wallet bayar"].some(k => lowInput.includes(k))) {
        reply = "Pembayaran mengikuti arahan admin MarPay melalui WhatsApp. Admin akan memberikan metode pembayaran yang tersedia seperti transfer, e-wallet, atau QRIS jika tersedia.";
      }
      // 4. Aman / terpercaya
      else if (["aman", "percaya", "trusted", "penipuan", "real", "asli", "terpercaya", "scam"].some(k => lowInput.includes(k))) {
        reply = "MarPay berusaha melayani transaksi dengan aman dan jelas. Untuk memastikan detail pesanan, silakan konfirmasi langsung ke admin WhatsApp MarPay.";
      }
      // 5. Jam layanan
      else if (["jam buka", "buka jam", "online", "admin online", "respon", "fast respon", "kapan buka"].some(k => lowInput.includes(k))) {
        reply = "Admin MarPay akan membalas secepat mungkin saat online. Silakan kirim pesan WhatsApp dan tunggu konfirmasi dari admin.";
      }
      // 6. Pulsa
      else if (["pulsa", "telkomsel", "tsel", "axis", "xl", "indosat", "im3", "tri", "3", "smartfren"].some(k => lowInput.includes(k))) {
        reply = "MarPay menyediakan pulsa Telkomsel, Axis/XL, Indosat/IM3, Tri, dan Smartfren. Untuk harga terbaru dan order, silakan hubungi admin WhatsApp.";
      }
      // 7. E-wallet
      else if (["dana", "ovo", "gopay", "go pay", "shopeepay", "shopee pay", "spay", "e-wallet", "ewallet", "top up", "topup", "isi saldo"].some(k => lowInput.includes(k))) {
        reply = "Top up e-wallet seperti DANA, OVO, GoPay, and ShopeePay tersedia di MarPay. Silakan hubungi admin WhatsApp untuk nominal and harga terbaru.";
      }
      // 8. PLN
      else if (["pln", "token", "listrik", "token listrik", "pascabayar"].some(k => lowInput.includes(k))) {
        reply = "Token PLN tersedia di MarPay. Untuk cek nominal, harga, atau bantuan pembelian, silakan hubungi admin WhatsApp.";
      }
      // 9. Produk fisik
      else if (["produk fisik", "barang", "baju", "hoodie", "skincare", "akrilik", "sertifikat", "fashion", "kemeja"].some(k => lowInput.includes(k))) {
        reply = "MarPay menyediakan produk fisik pilihan seperti fashion, skincare, and produk lainnya sesuai katalog. Silakan cek produk di website atau hubungi admin WhatsApp.";
      }
      // 10. Produk digital
      else if (["produk digital", "digital", "otp", "voucher", "game", "topup game", "top up game", "saldo game"].some(k => lowInput.includes(k))) {
        reply = "MarPay menyediakan layanan digital tertentu seperti PPOB, top up, and produk digital sesuai ketersediaan. Untuk detail terbaru, silakan hubungi admin WhatsApp.";
      }
      // 11. Harga
      else if (["harga", "berapa", "price", "list harga", "daftar harga", "murah", "diskon", "promo"].some(k => lowInput.includes(k))) {
        reply = "Harga bisa berbeda tergantung produk and nominal. Silakan cek katalog MarPay atau hubungi admin WhatsApp untuk harga terbaru.";
      }
      // 12. Stok
      else if (["stok", "ready", "tersedia", "kosong", "ada barang", "masih ada"].some(k => lowInput.includes(k))) {
        reply = "Untuk memastikan stok terbaru, silakan hubungi admin WhatsApp MarPay karena stok bisa berubah sewaktu-waktu.";
      }
      // 13. Pengiriman
      else if (["ongkir", "pengiriman", "kirim", "kurir", "paket", "resi", "cek resi", "cod"].some(k => lowInput.includes(k))) {
        reply = "Untuk produk fisik, pengiriman and ongkir akan dikonfirmasi oleh admin MarPay. Jika sudah ada resi, Anda bisa cek status pengiriman sesuai info dari admin.";
      }
      // 14. COD
      else if (["cod", "bayar ditempat", "bayar di tempat"].some(k => lowInput.includes(k))) {
        reply = "Untuk saat ini ketersediaan COD mengikuti jenis produk and arahan admin. Silakan hubungi admin WhatsApp untuk konfirmasi.";
      }
      // 15. Refund / batal
      else if (["refund", "batal", "cancel", "uang kembali", "pengembalian", "komplain"].some(k => lowInput.includes(k))) {
        reply = "Untuk pembatalan, refund, atau komplain, silakan hubungi admin WhatsApp MarPay dengan detail pesanan agar bisa dibantu.";
      }
      // 16. Login / akun
      else if (["login", "daftar", "akun", "profil", "password", "masuk"].some(k => lowInput.includes(k))) {
        reply = "Fitur akun MarPay digunakan untuk kebutuhan profil and riwayat. Jika ada kendala login/akun, silakan hubungi admin WhatsApp.";
      }
      // 17. Keranjang
      else if (["keranjang", "cart", "masuk keranjang", "hapus keranjang"].some(k => lowInput.includes(k))) {
        reply = "Anda bisa menambahkan produk ke keranjang terlebih dahulu, lalu lanjut checkout and konfirmasi pesanan lewat WhatsApp admin.";
      }
      // 18. Bantuan umum
      else if (["bantuan", "cs", "admin", "kontak", "whatsapp", "wa", "hubungi"].some(k => lowInput.includes(k))) {
        reply = "Untuk bantuan langsung, silakan klik tombol Hubungi Admin WhatsApp agar admin MarPay bisa membantu pesanan Anda.";
      }
      // 19. Terima kasih
      else if (["makasih", "terima kasih", "thanks", "thank you", "oke", "ok", "sip"].some(k => lowInput.includes(k))) {
        reply = "Sama-sama! Jika butuh bantuan lain seputar MarPay, silakan tanyakan di sini atau hubungi admin WhatsApp.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setIsLoading(false);
    }, 800);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent('Halo Admin MarPay, saya butuh bantuan order...')}`, '_blank');
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
                  placeholder="Ketik pertanyaan (order, bayar, pulsa...)"
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
