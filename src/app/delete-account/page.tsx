"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * Public Route for Google Play Store Account Deletion Compliance.
 * Accessible at /delete-account
 */
export default function PublicAccountDeletionPage() {
  const router = useRouter();

  const handleWhatsApp = () => {
    const adminWhatsApp = "6283851278935";
    const message = "Halo Admin MarPay, saya ingin mengajukan permintaan penghapusan akun saya.";
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-6 border-b border-gray-100 flex items-center justify-center relative bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden relative shadow-sm">
            <Image src="/profil1.png" alt="MarPay Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900">MarPay</span>
        </div>
      </header>

      <main className="px-6 py-10 space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 mx-auto mb-4 shadow-sm border border-red-100">
            <Trash2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Penghapusan Akun MarPay</h1>
          <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
            Halaman ini disediakan untuk memenuhi kebijakan transparansi data dan penghapusan akun pengguna MarPay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 space-y-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Informasi Utama
            </h3>
            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
              Pengguna dapat meminta penghapusan akun MarPay kapan saja. Permintaan akan diproses secara manual oleh tim admin kami untuk memastikan keamanan data Anda.
            </p>
            <div className="pt-2 space-y-3">
               <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-red-500 uppercase mb-2">Data Terhapus Permanen:</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Seluruh data profil, informasi login, alamat tersimpan, dan data preferensi pengguna akan dihapus secara permanen dari server aktif kami.</p>
               </div>
               <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">Penyimpanan Terbatas:</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Data transaksi keuangan tetap disimpan sesuai dengan kewajiban hukum dan administrasi perpajakan yang berlaku.</p>
               </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xl shadow-gray-100 space-y-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Prosedur Pengajuan:</h3>
            <div className="space-y-4">
              {[
                "Hubungi Admin melalui WhatsApp 083851278935.",
                "Kirim pesan berisi permintaan hapus akun.",
                "Sertakan Nama & Nomor HP yang terdaftar.",
                "Verifikasi identitas oleh tim MarPay.",
                "Penghapusan diproses dalam 1-7 hari kerja."
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-md">{idx + 1}</div>
                  <p className="text-sm text-gray-700 font-bold leading-tight">{step}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Mulai Pengajuan via WhatsApp
              </Button>
            </div>
          </section>
        </div>

        <div className="text-center pt-8 border-t border-gray-50">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
             MarPay Digital Solution • Customer Privacy Policy
           </p>
        </div>
      </main>
    </div>
  );
}
