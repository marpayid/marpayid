
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, HelpCircle, ChevronRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpCenterPage() {
  const router = useRouter();

  const faqs = [
    "Cara transaksi produk digital?",
    "Metode pembayaran apa saja yang tersedia?",
    "Berapa lama proses pengiriman?",
    "Cara komplain pesanan?",
  ];

  const handleWhatsApp = () => {
    window.open(`https://wa.me/6283851278935?text=${encodeURIComponent('Halo Admin MarPay, saya butuh bantuan terkait...')}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Pusat Bantuan</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <div className="bg-gradient-to-br from-primary to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
          <h3 className="text-lg font-bold mb-2">Butuh Bantuan Cepat?</h3>
          <p className="text-[11px] text-white/80 leading-relaxed mb-6">
            Tim support kami siap membantu kendala Anda setiap hari pukul 08.00 - 22.00 WIB.
          </p>
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-white text-primary font-bold h-12 rounded-2xl flex items-center gap-2 hover:bg-white/90"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Admin
          </Button>
        </div>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 px-1">Pertanyaan Populer (FAQ)</h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${idx !== faqs.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <span className="text-xs font-medium text-gray-700">{faq}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Email Support</h4>
            <p className="text-[10px] text-gray-500 mt-1">support@marpay.com</p>
            <p className="text-[10px] text-gray-500">Respon dalam 24 jam kerja.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
