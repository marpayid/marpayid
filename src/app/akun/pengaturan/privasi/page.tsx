
"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const router = useRouter();

  const sections = [
    {
      title: "Informasi yang Kami Kumpulkan",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      content: [
        "Nama pengguna",
        "Nomor telepon / WhatsApp",
        "Alamat email",
        "Informasi transaksi belanja",
        "Data yang diberikan pengguna saat menggunakan layanan MarPay"
      ]
    },
    {
      title: "Penggunaan Informasi",
      icon: Eye,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      content: [
        "Memproses pesanan dan transaksi",
        "Memberikan layanan pelanggan",
        "Mengirim informasi terkait status pesanan",
        "Meningkatkan kualitas layanan MarPay",
        "Menjaga keamanan akun pengguna"
      ]
    },
    {
      title: "Perlindungan Data",
      icon: Lock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      text: "MarPay berupaya menjaga keamanan data pengguna dan tidak menjual atau membagikan data pribadi kepada pihak ketiga tanpa izin pengguna, kecuali diwajibkan oleh hukum yang berlaku."
    },
    {
      title: "Perubahan Kebijakan",
      icon: RefreshCw,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      text: "Kebijakan Privasi dapat diperbarui sewaktu-waktu dan perubahan akan ditampilkan pada halaman ini agar pengguna tetap mendapatkan informasi terbaru."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Kebijakan Privasi</h1>
      </header>

      <main className="pt-24 px-4 space-y-6 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-primary to-emerald-700 p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <ShieldCheck className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/10 -rotate-12" />
          <h2 className="text-xl font-black mb-2">Privasi Anda Prioritas Kami</h2>
          <p className="text-xs text-white/80 leading-relaxed font-medium">
            MarPay menghargai dan berkomitmen penuh untuk melindungi privasi seluruh pengguna dalam menggunakan layanan kami.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <section key={idx} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${section.bgColor} ${section.color} rounded-xl flex items-center justify-center`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{section.title}</h3>
              </div>
              
              {section.content ? (
                <ul className="space-y-2 pl-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-1.5 shrink-0" />
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-600 font-medium leading-relaxed pl-2">
                  {section.text}
                </p>
              )}
            </section>
          ))}
        </div>

        <section className="bg-[#F4F9FF] p-6 rounded-[28px] border border-[#E1EEFF] space-y-4">
          <div className="flex items-center gap-3">
             <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
             <h3 className="text-sm font-black text-gray-800">Hubungi Kami</h3>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Jika memiliki pertanyaan terkait kebijakan privasi, silakan hubungi kami melalui:
          </p>
          <div className="space-y-2">
             <p className="text-xs font-bold text-[#3B82F6]">WhatsApp: 083851278935</p>
             <p className="text-xs font-bold text-[#3B82F6]">Email: cs.marpay@gmail.com</p>
             <p className="text-xs font-bold text-[#3B82F6]">Website: marpay.shop</p>
          </div>
        </section>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-6">
          Pembaruan Terakhir: Januari 2024
        </p>
      </main>
    </div>
  );
}
