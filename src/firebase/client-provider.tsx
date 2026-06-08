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

    // Basic validation to prevent immediate crash if env vars are missing
    const hasConfig = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined';

    try {
      const existingApp = getApps().length > 0 ? getApp() : null;
      
      // If no config, we still initialize to prevent Context errors, but auth/db will fail gracefully on use
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      const db: Firestore = getFirestore(app);
      const auth: Auth = getAuth(app);
      
      return { app, db, auth };
    } catch (err) {
      console.error("Firebase Initialization Warning:", err);
      return { app: null, db: null, auth: null };
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (firebaseInstance.auth) {
        try {
          await setPersistence(firebaseInstance.auth, browserLocalPersistence);
        } catch (err) {
          // Ignore persistence errors in preview
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

  // Provide the instances even if null to allow app to render and use dummy data
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