"use client"

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function MarPayAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya AI MarPay. Ada yang bisa saya bantu terkait produk digital atau fisik kami?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const adminWhatsApp = "6283851278935";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error();
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi gangguan koneksi. Silakan hubungi admin WhatsApp kami untuk bantuan langsung.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent('Halo Admin MarPay, saya butuh bantuan order...')}`, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-[72px] right-4 z-[900] bg-primary text-white p-3 rounded-full shadow-xl shadow-primary/30 transition-all active:scale-90 hover:scale-105 flex items-center gap-2 px-5 border border-white/20",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Bot className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-wider">Chat AI</span>
      </button>

      {/* Chat Popup */}
      <div
        className={cn(
          "fixed inset-x-4 bottom-20 md:left-auto md:right-4 md:w-[350px] bg-white z-[950] rounded-[28px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="bg-primary p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">AI MarPay CS</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold opacity-80 uppercase">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] p-3.5 rounded-[20px] text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10" 
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] font-bold uppercase">AI Mengetik...</span>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Quick Action */}
        <div className="px-4 py-2 bg-white border-t border-gray-50">
          <button 
            onClick={handleWhatsApp}
            className="w-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase py-2.5 rounded-xl border border-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Admin WhatsApp
          </button>
        </div>

        {/* Input */}
        <div className="p-4 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Ketik pertanyaan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button onClick={handleSendMessage} disabled={isLoading} size="icon" className="rounded-xl h-11 w-11 bg-primary text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}