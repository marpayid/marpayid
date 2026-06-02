
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
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

export default function SecurityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  if (!authLoading && !user) {
    router.push('/login');
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
      setIsPasswordModalOpen(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Gagal mengubah password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { label: 'Ubah Password', icon: Lock, value: '**********', onClick: () => setIsPasswordModalOpen(true) },
    { label: 'Email Terdaftar', icon: User, value: user?.email || '', disabled: true },
  ];

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Keamanan Akun</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {options.map((opt, idx) => (
            <div 
              key={opt.label}
              onClick={opt.onClick}
              className={`flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer ${idx !== options.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <opt.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{opt.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{opt.value}</p>
                </div>
              </div>
              {!opt.disabled && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 text-center px-6 leading-relaxed">
          Kami menjaga privasi dan keamanan data Anda dengan standar enkripsi terbaru.
        </p>
      </main>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
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
    </div>
  );
}
