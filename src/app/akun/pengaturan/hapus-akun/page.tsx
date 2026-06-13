"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, MessageCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountDeletionPage() {
  const router = useRouter();

  const handleWhatsApp = () => {
    const adminWhatsApp = "6283851278935";
    const message = "Halo Admin MarPay, saya ingin mengajukan permintaan penghapusan akun saya.";
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Hapus Akun MarPay</h1>
      </header>

      <main className="pt-24 px-4 space-y-6 max-w-md mx-auto">
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 leading-tight">Minta Penghapusan Akun</h2>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Pengguna dapat meminta penghapusan akun MarPay dengan menghubungi Admin MarPay melalui WhatsApp. Proses ini akan menghapus data akses Anda secara permanen.
          </p>
        </div>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Langkah-Langkah:</h3>
          <div className="space-y-4">
            {[
              "Hubungi Admin MarPay melalui WhatsApp 083851278935.",
              "Sertakan nama akun dan nomor telepon yang terdaftar.",
              "Tim MarPay akan memverifikasi permintaan Anda.",
              "Akun akan diproses untuk dihapus maksimal dalam 7 hari kerja."
            ].map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Data yang akan dihapus:</h4>
              <ul className="space-y-1.5 px-1">
                {["Informasi akun", "Data profil pengguna", "Data terkait akun"].map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-300 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data yang mungkin tetap disimpan:</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                Riwayat transaksi yang diperlukan untuk kebutuhan hukum, keamanan, dan administrasi tetap akan disimpan dalam database internal kami sesuai regulasi yang berlaku.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Hubungi Admin via WhatsApp
          </Button>
          <p className="text-center text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-widest">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </main>
    </div>
  );
}
