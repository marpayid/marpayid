'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: "Email dan password wajib diisi.",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({
        variant: "success",
        title: "Berhasil Masuk",
        description: "Selamat datang kembali di MarPay!",
      });
      router.push('/profile');
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      
      let message = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Akun tidak ditemukan atau password salah.";
      }
      
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 px-6 pt-4 pb-12 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Masuk Ke MarPay</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Silakan masuk untuk melanjutkan belanja Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 ml-1">Email</Label>
            <Input 
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="rounded-2xl h-14 border-gray-100 focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 ml-1">Password</Label>
            <Input 
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="rounded-2xl h-14 border-gray-100 focus-visible:ring-primary/20"
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk Sekarang"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Daftar Di Sini
            </Link>
          </p>
        </div>

        <div className="mt-auto pt-12 pb-4 text-center space-y-3">
          <p className="text-[11px] text-gray-400 font-medium">Butuh bantuan? Chat MarPay Support</p>
          <a 
            href="https://wa.me/6283851278935" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100 transition-colors hover:bg-green-100"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp: 083851278935
          </a>
        </div>
      </main>
    </div>
  );
}
