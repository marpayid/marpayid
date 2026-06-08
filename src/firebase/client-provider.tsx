'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { Loader2 } from 'lucide-react';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const firebaseInstance = useMemo(() => {
    if (typeof window === 'undefined') {
      return { app: null, db: null, auth: null };
    }

    try {
      // Inisialisasi App
      const existingApp = getApps().length > 0 ? getApp() : null;
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      
      // Inisialisasi layanan secara terpisah untuk mencegah crash jika config tidak lengkap
      let db: Firestore | null = null;
      try {
        db = getFirestore(app);
      } catch (dbErr) {
        console.warn("Firestore failed to initialize:", dbErr);
      }

      let auth: Auth | null = null;
      try {
        auth = getAuth(app);
      } catch (authErr) {
        console.warn("Firebase Auth failed to initialize:", authErr);
      }
      
      return { app, db, auth };
    } catch (err: any) {
      console.error("Firebase Initialization Error:", err);
      return { app: null, db: null, auth: null };
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (firebaseInstance.auth) {
        try {
          await setPersistence(firebaseInstance.auth, browserLocalPersistence);
        } catch (err) {
          // Ignore persistence errors
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, [firebaseInstance.auth]);

  if (typeof window === 'undefined' || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstance.app as any} 
      firestore={firebaseInstance.db as any} 
      auth={firebaseInstance.auth as any}
    >
      {children}
    </FirebaseProvider>
  );
};
