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
      // Initialize App
      const existingApp = getApps().length > 0 ? getApp() : null;
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      
      // Initialize services
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
