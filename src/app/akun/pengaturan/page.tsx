"use client"

import { useRouter } from 'next/navigation';
import { ArrowLeft, Languages, Moon, Info, ChevronRight, ShieldCheck, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Pengaturan</h1>
      </header>

      <main className="pt-20 px-4 space-y-4">
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">Bahasa</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Indonesia</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>

          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">Mode Gelap</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nonaktif</p>
              </div>
            </div>
            <Switch disabled />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <Link href="/akun/pengaturan/tentang">
            <div className="flex items-center justify-between p-5 border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Info className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800">Tentang Aplikasi</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Link>

          <Link href="/akun/pengaturan/syarat-ketentuan">
            <div className="flex items-center justify-between p-5 border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800">Syarat & Ketentuan</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Link>

          <Link href="/akun/pengaturan/privasi">
            <div className="flex items-center justify-between p-5 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800">Kebijakan Privasi</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Link>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <Link href="/akun/pengaturan/hapus-akun">
            <div className="flex items-center justify-between p-5 active:bg-red-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-red-600">Hapus Akun</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Link>
        </section>

        <div className="pt-6 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Versi 1.0.5</p>
        </div>
      </main>
    </div>
  );
}
