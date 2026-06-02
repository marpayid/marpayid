
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, PhoneCall, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpCenterPage() {
  const router = useRouter();

  const faqs = [
    {
      question: "Cara transaksi produk digital?",
      answer: "Pilih produk digital yang diinginkan, lakukan checkout, lalu kirim pesanan melalui WhatsApp. Admin akan memproses pesanan setelah pembayaran dikonfirmasi."
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Saat ini pembayaran dapat dilakukan melalui transfer bank dan QRIS yang tersedia pada saat checkout."
    },
    {
      question: "Berapa lama proses pengiriman?",
      answer: "Produk digital diproses dalam hitungan menit hingga maksimal 1x24 jam. Produk fisik diproses sesuai estimasi yang tertera pada halaman produk."
    },
    {
      question: "Cara komplain pesanan?",
      answer: "Jika mengalami kendala pada pesanan, silakan hubungi Admin melalui WhatsApp dengan menyertakan nomor pesanan dan bukti transaksi agar dapat segera dibantu."
    }
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
        <h1 className="text-lg font-bold text-gray-900">Pusat Bantuan</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <div className="bg-gradient-to-br from-[#00A859] to-[#008F4C] p-6 rounded-[28px] text-white shadow-lg shadow-primary/20">
          <h3 className="text-lg font-bold mb-2">Butuh Bantuan Cepat?</h3>
          <p className="text-[11px] text-white/80 leading-relaxed mb-6">
            Tim support kami siap membantu kendala Anda setiap hari pukul 08.00 - 22.00 WIB.
          </p>
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-white text-[#00A859] font-bold h-12 rounded-[18px] flex items-center gap-2 hover:bg-white/90 shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Admin
          </Button>
        </div>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 px-1">Pertanyaan Populer (FAQ)</h3>
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`item-${idx}`} 
                  className={idx !== faqs.length - 1 ? 'border-b border-gray-50' : 'border-none'}
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline text-left">
                    <span className="text-xs font-medium text-gray-800 leading-tight">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="bg-[#F4F9FF] p-5 rounded-[28px] border border-[#E1EEFF] flex gap-4">
          <div className="w-12 h-12 bg-white rounded-[18px] flex items-center justify-center text-[#3B82F6] shrink-0 shadow-sm">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Email Support</h4>
            <a 
              href="mailto:cs.marpay@gmail.com" 
              className="text-[11px] text-[#3B82F6] font-medium underline block mt-0.5"
            >
              cs.marpay@gmail.com
            </a>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Respon dalam 24 jam kerja.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
