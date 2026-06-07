"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Gavel, Info, CreditCard, RefreshCw, UserCheck, History, MessageSquare, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const router = useRouter();

  const terms = [
    {
      title: "1. Penggunaan Layanan",
      icon: Gavel,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      text: "Pengguna wajib menggunakan layanan MarPay sesuai hukum yang berlaku dan tidak melakukan aktivitas yang merugikan pihak lain."
    },
    {
      title: "2. Informasi Produk",
      icon: Info,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      text: "MarPay berusaha menampilkan informasi produk secara akurat. Namun, kesalahan penulisan, harga, atau ketersediaan produk dapat terjadi dan diperbaiki sewaktu-waktu."
    },
    {
      title: "3. Pembayaran",
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      text: "Setiap pesanan wajib diselesaikan sesuai metode pembayaran yang tersedia. Pesanan akan diproses setelah pembayaran berhasil dikonfirmasi oleh Admin."
    },
    {
      title: "4. Pembatalan dan Refund",
      icon: RefreshCw,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      text: "Pembatalan atau pengembalian dana akan diproses sesuai kebijakan yang berlaku dan mempertimbangkan jenis produk atau layanan yang dibeli."
    },
    {
      title: "5. Tanggung Jawab Pengguna",
      icon: UserCheck,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      text: "Pengguna bertanggung jawab penuh atas kerahasiaan data yang diberikan saat melakukan transaksi dan penggunaan akun di MarPay."
    },
    {
      title: "6. Perubahan Ketentuan",
      icon: History,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      text: "MarPay berhak memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya demi kenyamanan bersama."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Syarat & Ketentuan</h1>
      </header>

      <main className="pt-24 px-4 space-y-6 max-w-md mx-auto">
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <ShieldAlert className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-base font-black text-gray-900 leading-tight">Ketentuan Layanan</h2>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Versi 1.0.4</p>
             </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Selamat datang di MarPay. Dengan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku demi keamanan dan kenyamanan bersama.
          </p>
        </div>

        <div className="space-y-4">
          {terms.map((term, idx) => (
            <section key={idx} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-3 transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${term.bgColor} ${term.color} rounded-xl flex items-center justify-center`}>
                  <term.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-tight">{term.title}</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed pl-0.5">
                {term.text}
              </p>
            </section>
          ))}
        </div>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
               <MessageSquare className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-black text-gray-800 uppercase">Hubungi Support</h3>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Jika memiliki pertanyaan seputar syarat dan ketentuan layanan kami, silakan hubungi tim legal support MarPay:
          </p>
          <div className="grid grid-cols-1 gap-2">
             <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
               <span className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp Admin</span>
               <span className="text-xs font-black text-primary">083851278935</span>
             </div>
             <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
               <span className="text-[10px] font-bold text-gray-400 uppercase">Email Layanan</span>
               <span className="text-xs font-black text-primary">cs.marpay@gmail.com</span>
             </div>
          </div>
        </section>

        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] py-8">
          MarPay Legal Solution • Versi 1.0.4
        </p>
      </main>
    </div>
  );
}
