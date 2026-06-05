
"use client"

import { useState, useEffect } from 'react';
import { Bell, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useFirebaseApp } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';

export function NotificationPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const db = useFirestore();
  const { user } = useUser();
  const app = useFirebaseApp();

  useEffect(() => {
    // Cek preferensi di localStorage
    const status = localStorage.getItem('marpay_notif_status');
    
    if (!status) {
      // Tunggu 10 detik sebelum menampilkan popup sesuai instruksi
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('marpay_notif_status', 'dismissed');
  };

  const handleEnable = async () => {
    try {
      const messaging = getMessaging(app);
      
      // Minta izin browser
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Ambil token FCM
        // Catatan: Anda harus mengganti placeholder VAPID KEY di bawah ini
        const token = await getToken(messaging, {
          vapidKey: 'GANTI_DENGAN_VAPID_KEY_ANDA' // Dapatkan dari Firebase Console > Cloud Messaging > Web Push
        });

        if (token) {
          // Cek apakah token sudah ada di DB
          const tokensRef = collection(db, 'notification_tokens');
          const q = query(tokensRef, where('token', '==', token));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Simpan token baru ke Firestore
            await addDoc(tokensRef, {
              token: token,
              userId: user?.uid || 'anonymous',
              platform: 'web',
              createdAt: serverTimestamp()
            });
          }

          localStorage.setItem('marpay_notif_status', 'granted');
        }
      } else {
        localStorage.setItem('marpay_notif_status', 'denied');
      }
    } catch (error) {
      console.error('Gagal mengaktifkan notifikasi:', error);
    } finally {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[2500] animate-in slide-in-from-bottom-full duration-500 max-w-sm mx-auto">
      <div className="bg-white rounded-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Bell className="w-6 h-6 animate-swing" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 leading-tight">
              🎁 Dapatkan Promo & Voucher MarPay
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Aktifkan notifikasi untuk mendapatkan promo terbaru, voucher eksklusif, dan informasi produk baru.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button 
            onClick={handleEnable}
            className="flex-1 bg-primary text-white font-black h-11 rounded-xl text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Aktifkan Notifikasi
          </Button>
          <button 
            onClick={handleDismiss}
            className="flex-1 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors"
          >
            Nanti Saja
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Aman & Terenkripsi
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
