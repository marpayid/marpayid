"use client"

import { useRouter } from 'next/navigation';
import { Globe, MessageCircle, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Tentang MarPay</h1>
      </header>

      <main className="pt-24 px-6 space-y-8 max-w-md mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white relative">
            <Image 
              src="/profil1.png" 
              alt="MarPay Logo" 
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">MarPay Marketplace</h2>
          </div>
        </div>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">MarPay</span> adalah marketplace digital dan produk pilihan yang menyediakan berbagai kebutuhan belanja secara online, mulai dari produk digital, layanan, hingga produk fisik pilihan.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kami berkomitmen memberikan pengalaman belanja yang mudah, cepat, dan aman bagi seluruh pengguna melalui sistem otomatisasi dan dukungan admin yang responsif.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Informasi Layanan</h3>
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <a 
              href="https://marpay.shop" 
              target="_blank" 
              className="flex items-center justify-between p-5 border-b border-gray-50 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Website Resmi</h4>
                  <p className="text-[10px] text-gray-400 font-medium">marpay.shop</p>
                </div>
              </div>
            </a>

            <a 
              href="https://wa.me/6283851278935" 
              target="_blank" 
              className="flex items-center justify-between p-5 border-b border-gray-50 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">WhatsApp Support</h4>
                  <p className="text-[10px] text-gray-400 font-medium">083851278935</p>
                </div>
              </div>
            </a>

            <a 
              href="mailto:cs.marpay@gmail.com" 
              className="flex items-center justify-between p-5 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Email Layanan</h4>
                  <p className="text-[10px] text-gray-400 font-medium">cs.marpay@gmail.com</p>
                </div>
              </div>
            </a>
          </div>
        </section>

        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Terverifikasi & Aman
          </div>
          <p className="text-[9px] text-gray-300 mt-4 font-medium uppercase tracking-[0.2em]">MarPay Digital Solution</p>
        </div>
      </main>
    </div>
  );
}
