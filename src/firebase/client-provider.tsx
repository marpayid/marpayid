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
      // Ensure app is only initialized once
      const existingApp = getApps().length > 0 ? getApp() : null;
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      
      // Initialize services using the valid app instance
      const db: Firestore = getFirestore(app);
      const auth: Auth = getAuth(app);
      
      return { app, db, auth };
    } catch (err: any) {
      console.error("Firebase Initialization Error:", err);
      return { app: null, db: null, auth: null };
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // Configure auth persistence once on the client
      if (firebaseInstance.auth) {
        try {
          await setPersistence(firebaseInstance.auth, browserLocalPersistence);
        } catch (err) {
          console.warn("Auth persistence could not be set:", err);
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, [firebaseInstance.auth]);

  // Prevent rendering children until Firebase is ready on the client
  if (typeof window === 'undefined' || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inisialisasi Sistem...</p>
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
