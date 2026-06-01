'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { app, db, auth } = useMemo(() => {
    const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db: Firestore = getFirestore(app);
    const auth: Auth = getAuth(app);
    return { app, db, auth };
  }, []);

  useEffect(() => {
    // Memastikan persistensi sesi disetel ke local agar login tidak hilang saat refresh
    setPersistence(auth, browserLocalPersistence)
      .then(() => setIsInitialized(true))
      .catch((err) => {
        console.error("Auth persistence error:", err);
        setIsInitialized(true);
      });
  }, [auth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <FirebaseProvider firebaseApp={app} firestore={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
};
