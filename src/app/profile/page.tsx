
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
  Loader2,
  Search,
  MessageCircle,
  Ticket,
  FileText
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
  const [wishlistCount, setWishlistCount] = useState(0);

  const userProfileRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profileData, loading: profileLoading, error: profileError } = useDoc(userProfileRef);

  useEffect(() => {
    const updateCounts = () => {
      const saved = localStorage.getItem('marpay_wishlist');
      if (saved) {
        setWishlistCount(JSON.parse(saved).length);
      }
    };
    updateCounts();
    window.addEventListener('wishlist-updated', updateCounts);
    return () => window.removeEventListener('wishlist-updated', updateCounts);
  }, []);

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
      label: 'Cek Resi Pengiriman', 
      description: 'Lacak status paket pesanan fisik Anda.',
      icon: Search, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      path: '/cek-resi',
      protected: false
    },
    { 
      label: 'Wishlist Saya', 
      description: 'Produk favorit yang telah disimpan.',
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      path: '/favorit',
      protected: false
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
      label: 'Pusat Bantuan', 
      description: 'Bantuan dan pertanyaan seputar MarPay.',
      icon: HelpCircle, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '/akun/bantuan',
      protected: false
    },
    { 
      label: 'Keamanan Akun', 
      description: 'Kelola keamanan akun dan privasi.',
      icon: ShieldCheck, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      path: '/akun/pengaturan',
      protected: false
    },
    { 
      label: 'Pengaturan App', 
      description: 'Aturan penggunaan layanan di MarPay.',
      icon: FileText, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '/akun/pengaturan',
      protected: false
    },
  ];

  const benefits = [
    { 
      label: 'Belanja Aman', 
      icon: ShieldCheck, 
      desc: 'Transaksi aman dan terpercaya.' 
    },
    { 
      label: 'Cek Resi', 
      icon: Search, 
      desc: 'Lacak paket kapan saja.' 
    },
    { 
      label: 'CS Respons Cepat', 
      icon: MessageCircle, 
      desc: 'Siap membantu setiap hari.' 
    },
    { 
      label: 'Voucher Tersedia', 
      icon: Ticket, 
      desc: 'Promo dan voucher menarik.' 
    },
  ];

  const isLoggedIn = !!user;

  if (authLoading || (isLoggedIn && profileLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const userName = profileData?.fullName || profileData?.name || user?.displayName || (isLoggedIn ? "Pengguna MarPay" : "Masuk MarPay");
  const userStatus = isLoggedIn ? "AKUN TERVERIFIKASI" : "Belum Masuk";
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
          <div className="mt-8">
            <Link href="/favorit" className="block w-full">
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center justify-between transition-colors active:bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                    <Heart className="w-5 h-5 fill-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Produk Favorit</p>
                    <p className="text-base font-black text-gray-800">{wishlistCount}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-200" />
              </div>
            </Link>
          </div>
        )}
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Keuntungan Belanja di MarPay</h3>
            <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">Belanja Nyaman, Aman, dan Terpercaya.</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="flex flex-col items-center gap-2 text-center group">
                <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/5 transition-all group-active:scale-95 shadow-sm">
                  <benefit.icon className="w-5 h-5 stroke-[2px]" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-gray-800 uppercase tracking-tighter leading-tight block">{benefit.label}</span>
                  <p className="text-[7px] text-gray-400 leading-tight font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
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
