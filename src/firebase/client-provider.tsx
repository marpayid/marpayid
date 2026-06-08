'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { Loader2, ShieldAlert } from 'lucide-react';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const firebaseInstance = useMemo(() => {
    if (typeof window === 'undefined') {
      return { app: null, db: null, auth: null };
    }

    // Validate config before initialization to prevent getAuth(app) from throwing invalid-api-key
    const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined' && 
                         !!firebaseConfig.projectId && firebaseConfig.projectId !== 'undefined';

    if (!isConfigValid) {
      return { app: null, db: null, auth: null };
    }

    try {
      const existingApp = getApps().length > 0 ? getApp() : null;
      const app: FirebaseApp = existingApp || initializeApp(firebaseConfig);
      const db: Firestore = getFirestore(app);
      const auth: Auth = getAuth(app);
      return { app, db, auth };
    } catch (err: any) {
      console.error("Firebase Initialization Error:", err);
      // Don't set error state here yet, let the persistence check handle it or return nulls
      return { app: null, db: null, auth: null };
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (firebaseInstance.auth) {
        try {
          await setPersistence(firebaseInstance.auth, browserLocalPersistence);
        } catch (err: any) {
          console.error("Auth Persistence Error:", err);
        }
      } else {
        // If auth is null but we're on client, check if it's due to missing config
        if (typeof window !== 'undefined' && (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined')) {
          setConfigError("Firebase configuration is missing or invalid. Please check your environment variables.");
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

  // Handle missing configuration gracefully
  if (configError || !firebaseInstance.app || !firebaseInstance.db || !firebaseInstance.auth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Konfigurasi Firebase Diperlukan</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Silakan hubungkan project Anda ke Firebase melalui Firebase Studio atau atur Environment Variables di Vercel.
        </p>
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 w-full max-w-sm text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Checklist Variabel:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-[11px]">
              <div className={`w-1.5 h-1.5 rounded-full ${firebaseConfig.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={firebaseConfig.apiKey ? 'text-gray-700' : 'text-red-500'}>API_KEY: {firebaseConfig.apiKey ? 'OK' : 'MISSING'}</span>
            </li>
            <li className="flex items-center gap-2 text-[11px]">
              <div className={`w-1.5 h-1.5 rounded-full ${firebaseConfig.projectId ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={firebaseConfig.projectId ? 'text-gray-700' : 'text-red-500'}>PROJECT_ID: {firebaseConfig.projectId ? 'OK' : 'MISSING'}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstance.app} 
      firestore={firebaseInstance.db} 
      auth={firebaseInstance.auth}
    >
      {children}
    </FirebaseProvider>
  );
};