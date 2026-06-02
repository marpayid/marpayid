
'use client';

import { BottomNav } from '@/components/bottom-nav';
import { 
  Settings, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ClipboardList,
  Bell,
  ShoppingBag,
  Wallet,
  Package,
  CheckCircle,
  XCircle,
  LogIn,
  UserPlus,
  Edit,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser, useAuth, useDoc, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
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

export default function Profile() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  const userProfileRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profileData, loading: profileLoading, error: profileError } = useDoc(userProfileRef);

  useEffect(() => {
    if (profileError) {
      console.error("Firestore Error on Profile:", profileError);
    }
  }, [profileError]);

  useEffect(() => {
    if (profileData && !isEditModalOpen) {
      setEditForm({
        name: profileData.fullName || profileData.name || '',
        phone: profileData.phone || ''
      });
    } else if (user && !profileData && !profileLoading && !isEditModalOpen) {
      setEditForm({
        name: user.displayName || '',
        phone: ''
      });
    }
  }, [profileData, user, profileLoading, isEditModalOpen]);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.uid || !userProfileRef) {
      toast({ variant: "destructive", title: "Error", description: "Sesi Anda telah berakhir. Silakan login kembali." });
      return;
    }

    if (!editForm.name.trim() || !editForm.phone.trim()) {
      toast({ variant: "destructive", title: "Gagal", description: "Nama dan Nomor WhatsApp wajib diisi." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await setDoc(userProfileRef, {
        fullName: editForm.name.trim(),
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        email: user.email,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      toast({ variant: "success", title: "Berhasil", description: "Profil telah diperbarui." });
      setIsEditModalOpen(false);
    } catch (e: any) {
      console.error("Firestore Update Error:", e);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: e.message || "Gagal memperbarui profil." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { 
      label: 'Daftar Transaksi', 
      description: 'Lihat semua pesanan dan status transaksi Anda.',
      icon: ClipboardList, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '/akun/transaksi',
      protected: true
    },
    { 
      label: 'Wishlist Saya', 
      description: 'Produk favorit yang telah disimpan.',
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      path: '/akun/wishlist',
      protected: true
    },
    { 
      label: 'Alamat Pengiriman', 
      description: 'Kelola alamat pengiriman Anda.',
      icon: MapPin, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      path: '/akun/alamat',
      protected: true
    },
    { 
      label: 'Notifikasi', 
      description: 'Informasi pesanan dan promo terbaru.',
      icon: Bell, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      path: '/akun/notifikasi',
      protected: true
    },
    { 
      label: 'Pusat Bantuan', 
      description: 'Bantuan dan pertanyaan seputar MarPay.',
      icon: HelpCircle, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '/akun/bantuan'
    },
    { 
      label: 'Keamanan Akun', 
      description: 'Kelola keamanan akun dan data pribadi.',
      icon: ShieldCheck, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      path: '/akun/keamanan',
      protected: true
    },
    { 
      label: 'Pengaturan App', 
      description: 'Tema, preferensi, dan pengaturan aplikasi.',
      icon: Settings, 
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      path: '/akun/pengaturan'
    },
  ];

  const transactionStatuses = [
    { label: 'Menunggu', icon: Wallet, path: '/akun/transaksi?status=pending' },
    { label: 'Diproses', icon: Package, path: '/akun/transaksi?status=processing' },
    { label: 'Selesai', icon: CheckCircle, path: '/akun/transaksi?status=completed' },
    { label: 'Dibatalkan', icon: XCircle, path: '/akun/transaksi?status=cancelled' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLoggedIn = !!user;
  // Menampilkan fullName dari Firestore sebagai prioritas utama
  const userName = profileData?.fullName || profileData?.name || user?.displayName || (isLoggedIn ? "Pengguna MarPay" : "Masuk MarPay");
  const userStatus = isLoggedIn ? "Pengguna MarPay" : "Belum Masuk";
  const userSub = isLoggedIn ? (profileData?.email || user.email) : "Masuk atau daftar untuk menikmati semua fitur MarPay.";
  const userPhoto = profileData?.photoURL || user?.photoURL || "/profil1.png";

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white px-6 pt-14 pb-8 border-b border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl bg-gray-50">
              <AvatarImage src={userPhoto} />
              <AvatarFallback className="bg-primary text-white font-bold text-xl uppercase">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isLoggedIn && (
              <button 
                onClick={() => {
                  setEditForm({
                    name: profileData?.fullName || profileData?.name || user?.displayName || '',
                    phone: profileData?.phone || ''
                  });
                  setIsEditModalOpen(true);
                }}
                className="absolute bottom-0 right-0 w-6 h-6 bg-primary border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900 leading-tight">{userName}</h2>
            <p className="text-[10px] font-bold text-primary mt-0.5 uppercase tracking-wider">{userStatus}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed max-w-[200px]">{userSub}</p>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="grid grid-cols-2 gap-3 mt-8">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-primary text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Masuk
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-primary text-primary font-bold h-12 rounded-2xl flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Daftar
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Pesanan</p>
                <p className="text-base font-black text-gray-800">0</p>
              </div>
            </div>
            <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Produk Favorit</p>
                <p className="text-base font-black text-gray-800">0</p>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Status Pesanan</h3>
            <Link href="/akun/transaksi" className="text-[10px] font-bold text-primary">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {transactionStatuses.map((status) => {
              const content = (
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-active:scale-95 transition-all border border-gray-50">
                    <status.icon className="w-6 h-6 stroke-[1.5px]" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{status.label}</span>
                </div>
              );
              
              return isLoggedIn ? (
                <Link key={status.label} href={status.path}>{content}</Link>
              ) : (
                <div key={status.label} onClick={() => router.push('/login')}>{content}</div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => {
            const isItemActive = isLoggedIn || !item.protected;
            
            const content = (
              <div 
                className={cn(
                  "flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer transition-colors",
                  idx !== menuItems.length - 1 ? 'border-b border-gray-50' : '',
                  !isItemActive && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", item.bgColor, item.color)}>
                    <item.icon className="w-5 h-5 stroke-[2px]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.label}</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            );

            return isItemActive ? (
              <Link key={item.label} href={item.path}>{content}</Link>
            ) : (
              <div key={item.label} onClick={() => router.push('/login')}>{content}</div>
            );
          })}
        </section>

        {isLoggedIn && (
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full text-red-500 font-black gap-3 h-14 rounded-2xl border-2 border-transparent hover:bg-red-50 transition-all uppercase text-xs tracking-widest mt-4"
          >
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </Button>
        )}

        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] pb-10">
          MarPay Marketplace v1.0.4
        </p>
      </main>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nama Lengkap</Label>
              <Input 
                placeholder="Masukkan nama lengkap" 
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp</Label>
              <Input 
                placeholder="Contoh: 081234567890" 
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting} onClick={handleUpdateProfile} className="w-full bg-primary text-white font-bold h-12 rounded-xl">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
