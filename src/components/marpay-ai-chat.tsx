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
    const userMessageContent = originalInput.toLowerCase();
    const userMessage: Message = { role: 'user', content: originalInput };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulated "AI" response logic based on local FAQ keywords
    setTimeout(() => {
      let reply = "Maaf, CS AI MarPay belum memahami pertanyaan itu. Silakan hubungi admin WhatsApp untuk bantuan langsung.";

      if (userMessageContent.includes("cara order")) {
        reply = "Untuk order di MarPay, pilih produk yang diinginkan, lanjutkan checkout, lalu kirim pesanan ke WhatsApp admin untuk konfirmasi.";
      } else if (userMessageContent.includes("cara bayar") || userMessageContent.includes("pembayaran") || userMessageContent.includes("bayar")) {
        reply = "Pembayaran bisa mengikuti arahan admin MarPay melalui WhatsApp. Admin akan memberikan metode pembayaran yang tersedia seperti transfer/e-wallet/QRIS jika tersedia.";
      } else if (userMessageContent.includes("pulsa")) {
        reply = "MarPay menyediakan pulsa Telkomsel, Axis, Indosat, Tri, dan Smartfren. Untuk harga terbaru dan proses order, silakan hubungi admin WhatsApp.";
      } else if (userMessageContent.includes("dana")) {
        reply = "Top up DANA tersedia di MarPay. Silakan hubungi admin WhatsApp untuk nominal dan harga terbaru.";
      } else if (userMessageContent.includes("ovo")) {
        reply = "Top up OVO tersedia di MarPay. Silakan hubungi admin WhatsApp untuk nominal dan harga terbaru.";
      } else if (userMessageContent.includes("gopay")) {
        reply = "Top up GoPay tersedia di MarPay. Silakan hubungi admin WhatsApp untuk nominal dan harga terbaru.";
      } else if (userMessageContent.includes("shopeepay")) {
        reply = "Top up ShopeePay tersedia di MarPay. Silakan hubungi admin WhatsApp untuk nominal dan harga terbaru.";
      } else if (userMessageContent.includes("pln") || userMessageContent.includes("token")) {
        reply = "Token PLN tersedia di MarPay. Silakan hubungi admin WhatsApp untuk cek nominal dan harga terbaru.";
      } else if (userMessageContent.includes("produk")) {
        reply = "MarPay menyediakan produk digital, PPOB, dan produk fisik pilihan. Silakan cek katalog atau hubungi admin WhatsApp.";
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
