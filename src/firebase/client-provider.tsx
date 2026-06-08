'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigValid } from './config';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Inisialisasi Singleton dengan pengecekan keamanan build
  const firebaseInstance = useMemo(() => {
    if (typeof window === 'undefined' || !isFirebaseConfigValid()) {
      return { app: null, db: null, auth: null };
    }

    try {
      const existingApp = getApps().length > 0 ? getApp() : null;
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      const db: Firestore = getFirestore(app);
      const auth: Auth = getAuth(app);
      return { app, db, auth };
    } catch (err) {
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
          // Silent error for persistence
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, [firebaseInstance.auth]);

  // Jika sedang build atau config tidak valid, tampilkan loading atau children tanpa provider
  if (!isInitialized || !firebaseInstance.app) {
    if (typeof window === 'undefined') return <>{children}</>; // SSR/Build safety
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstance.app} 
      firestore={firebaseInstance.db!} 
      auth={firebaseInstance.auth!}
    >
      {children}
    </FirebaseProvider>
  );
};
