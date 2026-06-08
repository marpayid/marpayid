
'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigValid } from './config';
import { FirebaseProvider } from './provider';
import { AlertCircle, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

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
          console.error("Auth Persistence Error:", err);
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, [firebaseInstance.auth]);

  // Handle SSR or loading state
  if (typeof window === 'undefined') return <>{children}</>;

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle missing configuration to prevent perpetual hang in Studio/Vercel
  if (!firebaseInstance.app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <Alert variant="destructive" className="bg-white border-red-200">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-black">Konfigurasi Dibutuhkan</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed">
              Environment Variables Firebase belum terdeteksi. Silakan hubungkan Firebase melalui tab Dashboard di Firebase Studio atau atur Environment Variables secara manual.
            </AlertDescription>
          </Alert>
          <div className="bg-slate-900 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Environment Check</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">PROJECT_ID</span>
                <span className={firebaseConfig.projectId ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{firebaseConfig.projectId ? "OK" : "MISSING"}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">API_KEY</span>
                <span className={firebaseConfig.apiKey ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{firebaseConfig.apiKey ? "OK" : "MISSING"}</span>
              </div>
            </div>
          </div>
        </div>
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
