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
  
  const { data: profileData, loading: profileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    const updateCounts = () => {
      const saved = localStorage.getItem('marpay_wishlist');
      if (saved) {
        try {
          setWishlistCount(JSON.parse(saved).length);
        } catch (e) {
          setWishlistCount(0);
        }
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
    }
  }, [profileData, isEditModalOpen]);

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
    if (!user?.uid || !userProfileRef) return;
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
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      toast({ variant: "success", title: "Berhasil", description: "Profil telah diperbarui." });
      setIsEditModalOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui profil." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { label: 'Cek Resi Pengiriman', description: 'Lacak status paket pesanan fisik Anda.', icon: Search, color: 'text-orange-500', bgColor: 'bg-orange-50', path: '/cek-resi', protected: false },
    { label: 'Wishlist Saya', description: 'Produk favorit yang telah disimpan.', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50', path: '/favorit', protected: false },
    { label: 'Alamat Pengiriman', description: 'Kelola alamat pengiriman Anda.', icon: MapPin, color: 'text-emerald-500', bgColor: 'bg-emerald-50', path: '/akun/alamat', protected: true },
    { label: 'Pusat Bantuan', description: 'Bantuan dan pertanyaan seputar MarPay.', icon: HelpCircle, color: 'text-purple-500', bgColor: 'bg-purple-50', path: '/akun/bantuan', protected: false },
    { label: 'Keamanan Akun', description: 'Kelola keamanan akun dan privasi.', icon: ShieldCheck, color: 'text-cyan-500', bgColor: 'bg-cyan-50', path: '/akun/keamanan', protected: true },
    { label: 'Pengaturan App', description: 'Aturan penggunaan layanan di MarPay.', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50', path: '/akun/pengaturan', protected: false },
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
  const userPhoto = profileData?.photoURL || user?.photoURL || "/profil-1.png";

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
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 w-6 h-6 bg-primary border-2 border-white rounded-full flex items-center justify-center text-white"
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
              <Button className="w-full bg-primary text-white font-bold h-12 rounded-2xl">Masuk</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-primary text-primary font-bold h-12 rounded-2xl">Daftar</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link href="/favorit" className="block w-full">
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Favorit</p>
                  <p className="text-base font-black text-gray-800">{wishlistCount}</p>
                </div>
              </div>
            </Link>
            <Link href="/akun/voucher" className="block w-full">
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                <Ticket className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Voucher</p>
                  <p className="text-base font-black text-gray-800">0</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => {
            const isItemActive = isLoggedIn || !item.protected;
            const content = (
              <div className={cn("flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer", idx !== menuItems.length - 1 ? 'border-b border-gray-50' : '', !isItemActive && "opacity-60")}>
                <div className="flex items-center gap-4">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", item.bgColor, item.color)}>
                    <item.icon className="w-5 h-5 stroke-[2px]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.label}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            );
            return isItemActive ? <Link key={item.label} href={item.path}>{content}</Link> : <div key={item.label} onClick={() => router.push('/login')}>{content}</div>;
          })}
        </section>

        {isLoggedIn && (
          <Button onClick={handleLogout} variant="ghost" className="w-full text-red-500 font-black h-14 rounded-2xl border-2 border-transparent hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-2" /> Keluar Akun
          </Button>
        )}
      </main>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Edit Profil</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nama Lengkap</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nomor WhatsApp</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="rounded-xl" />
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