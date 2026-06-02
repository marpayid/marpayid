
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Phone, Lock, ChevronRight, 
  Loader2, Mail, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useDoc, useFirestore } from '@/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SecurityPage() {
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [activeModal, setActiveModal] = useState<'password' | 'phone' | 'email' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for forms
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const userDocRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profileData, loading: profileLoading } = useDoc(userDocRef);

  if (!authLoading && !user) {
    router.replace('/login');
    return null;
  }

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({ variant: "destructive", title: "Gagal", description: "Lengkapi semua bidang." });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast({ variant: "destructive", title: "Gagal", description: "Konfirmasi password tidak cocok." });
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(user!.email!, passwords.current);
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, passwords.new);
      
      toast({ variant: "success", title: "Berhasil", description: "Password telah diubah." });
      setActiveModal(null);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Gagal mengubah password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) {
      toast({ variant: "destructive", title: "Gagal", description: "Masukkan nomor WhatsApp baru." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (userDocRef) {
        await setDoc(userDocRef, { 
          phone: newPhone.trim(),
          updatedAt: serverTimestamp() 
        }, { merge: true });
        
        toast({ variant: "success", title: "Berhasil", description: "Nomor WhatsApp diperbarui." });
        setActiveModal(null);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui nomor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { 
      label: 'Ubah Nomor WhatsApp', 
      icon: Phone, 
      value: profileData?.phone || 'Belum diatur', 
      onClick: () => { setNewPhone(profileData?.phone || ''); setActiveModal('phone'); },
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Ubah Email', 
      icon: Mail, 
      value: user?.email || '', 
      onClick: () => { setNewEmail(user?.email || ''); setActiveModal('email'); },
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Ubah Password', 
      icon: Lock, 
      value: '**********', 
      onClick: () => setActiveModal('password'),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Keamanan Akun</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          {options.map((opt, idx) => (
            <div 
              key={opt.label}
              onClick={opt.onClick}
              className={cn(
                "flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer",
                idx !== options.length - 1 ? 'border-b border-gray-50' : ''
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", opt.bgColor, opt.color)}>
                  <opt.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{opt.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{opt.value}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </section>

        <section className="bg-[#F0FDF4] border border-[#DCFCE7] p-5 rounded-[24px] flex gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Keamanan Akun</h4>
            <p className="text-[10px] text-emerald-700/70 mt-1 leading-relaxed font-medium">
              Akun Anda terlindungi dengan enkripsi MarPay. Pastikan tidak memberikan kode OTP atau password kepada siapa pun.
            </p>
            {user?.emailVerified ? (
              <div className="flex items-center gap-1.5 mt-2 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Email Terverifikasi</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-2 text-orange-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Email Belum Verifikasi</span>
              </div>
            )}
          </div>
        </section>

        <p className="text-[10px] text-gray-400 text-center px-6 leading-relaxed">
          Kami menjaga privasi dan keamanan data Anda dengan standar keamanan terbaru untuk menjamin kenyamanan bertransaksi.
        </p>
      </main>

      {/* Dialog Ganti Password */}
      <Dialog open={activeModal === 'password'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ubah Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Password Saat Ini</Label>
              <Input 
                type="password"
                placeholder="••••••••" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Password Baru</Label>
              <Input 
                type="password"
                placeholder="Minimal 6 karakter" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Konfirmasi Password Baru</Label>
              <Input 
                type="password"
                placeholder="Ulangi password baru" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting} onClick={handleChangePassword} className="w-full bg-primary text-white font-bold h-12 rounded-xl">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ubah WhatsApp */}
      <Dialog open={activeModal === 'phone'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ubah Nomor WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp Baru</Label>
              <Input 
                type="tel"
                placeholder="Contoh: 081234567890" 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="rounded-xl border-gray-200"
              />
              <p className="text-[10px] text-gray-400 mt-1">Nomor ini digunakan untuk konfirmasi pesanan dan pengiriman.</p>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting} onClick={handleUpdatePhone} className="w-full bg-primary text-white font-bold h-12 rounded-xl">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Nomor Baru'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ubah Email (Informational/Placeholder) */}
      <Dialog open={activeModal === 'email'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ubah Alamat Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Email Baru</Label>
              <Input 
                type="email"
                placeholder="nama@email.com" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3">
              <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-600 leading-relaxed">
                Perubahan email memerlukan verifikasi ulang untuk menjamin keamanan akses akun MarPay Anda.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              disabled={isSubmitting} 
              onClick={() => toast({ title: "Fitur Segera Hadir", description: "Perubahan email sedang dalam tahap sinkronisasi sistem." })} 
              className="w-full bg-primary text-white font-bold h-12 rounded-xl"
            >
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
