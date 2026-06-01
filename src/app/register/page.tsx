
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: "Nama lengkap wajib diisi." });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: "Email tidak valid." });
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: "Nomor HP minimal 10 digit." });
      return false;
    }
    if (formData.password.length < 6) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: "Password minimal 6 karakter." });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: "Konfirmasi password tidak cocok." });
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!auth || !db) {
      toast({ variant: "destructive", title: "Sistem Error", description: "Layanan autentikasi tidak tersedia. Coba lagi nanti." });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        photoURL: '/profil1.png',
        accountStatus: 'active',
        role: 'customer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        variant: "success",
        title: "Pendaftaran Berhasil",
        description: "Selamat bergabung di MarPay!",
      });
      
      router.push('/profile');
    } catch (error: any) {
      console.error("Firebase Auth Error:", error.code, error.message);
      let message = "Terjadi kesalahan saat pendaftaran.";
      if (error.code === 'auth/email-already-in-use') {
        message = "Email ini sudah terdaftar. Silakan masuk.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Format email tidak valid.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Koneksi internet bermasalah.";
      }
      
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
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

      <main className="flex-1 px-6 pt-2 pb-12 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Daftar Akun MarPay</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Buat akun untuk pengalaman belanja terbaik.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold text-gray-700 uppercase ml-1">Nama Lengkap</Label>
            <Input 
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="rounded-2xl h-12 border-gray-100 focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold text-gray-700 uppercase ml-1">Email</Label>
            <Input 
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="rounded-2xl h-12 border-gray-100 focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold text-gray-700 uppercase ml-1">Nomor HP / WhatsApp</Label>
            <Input 
              type="tel"
              placeholder="0812xxxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="rounded-2xl h-12 border-gray-100 focus-visible:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-gray-700 uppercase ml-1">Password</Label>
              <Input 
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="rounded-2xl h-12 border-gray-100 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-gray-700 uppercase ml-1">Konfirmasi</Label>
              <Input 
                type="password"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="rounded-2xl h-12 border-gray-100 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Akun"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center space-y-3">
          <p className="text-[11px] text-gray-400 font-medium">Butuh bantuan? Chat MarPay Support</p>
          <a 
            href="https://wa.me/6283851278935" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100 transition-colors hover:bg-green-100"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Admin
          </a>
        </div>
      </main>
    </div>
  );
}
