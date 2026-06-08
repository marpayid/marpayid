'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const firebaseInstance = useMemo(() => {
    // Only initialize if we're on the client
    if (typeof window === 'undefined') {
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

  // If SSR or not initialized, render children but Firebase won't be available yet
  // useFirestore/useUser hooks will handle the null state gracefully
  if (typeof window === 'undefined' || !isInitialized) {
    return <>{children}</>;
  }

  // Provide the instances to the rest of the app
  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstance.app!} 
      firestore={firebaseInstance.db!} 
      auth={firebaseInstance.auth!}
    >
      {children}
    </FirebaseProvider>
  );
};