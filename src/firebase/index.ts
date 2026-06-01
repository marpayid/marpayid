'use client';

/**
 * Barrel file untuk Firebase MarPay.
 * Memastikan seluruh aplikasi menggunakan satu sumber kebenaran untuk Auth dan Firestore.
 */

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
