
'use client';

import { useMemo } from 'react';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Products as LocalProducts } from '@/app/lib/dummy-data';

/**
 * Hook untuk mengambil seluruh produk dari Firestore dengan fallback ke dummy-data.
 */
export function useProducts() {
  const db = useFirestore();
  
  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: remoteProducts, loading, error } = useCollection<any>(productsQuery);

  const products = useMemo(() => {
    // Jika masih loading, kita berikan array kosong agar UI tidak flicker dengan data lama yang tidak sinkron
    if (loading) return [];
    
    // Jika data remote ada, gunakan itu sebagai prioritas
    if (remoteProducts && remoteProducts.length > 0) {
      return remoteProducts;
    }
    
    // Jika remote kosong (misal baru mulai migrasi), gunakan data lokal
    return LocalProducts;
  }, [remoteProducts, loading]);

  return { products, loading, error };
}

/**
 * Hook untuk mengambil detail satu produk berdasarkan ID (Firestore string atau Local numeric).
 */
export function useProductDetail(id: string | number) {
  const db = useFirestore();
  const idStr = String(id);
  const isLocalId = !isNaN(Number(idStr)) && Number(idStr) < 10000; // Asumsi ID local di dummy-data numerik kecil

  const docRef = useMemo(() => {
    if (!db || isLocalId) return null;
    return doc(db, 'products', idStr);
  }, [db, idStr, isLocalId]);

  const { data: remoteProduct, loading, error } = useDoc<any>(docRef);

  const product = useMemo(() => {
    if (isLocalId) {
      return LocalProducts.find(p => String(p.id) === idStr);
    }
    
    if (remoteProduct) return remoteProduct;

    // Fallback: jika ID tidak ditemukan di Firestore, coba cari di local (untuk link lama)
    return LocalProducts.find(p => String(p.id) === idStr);
  }, [idStr, isLocalId, remoteProduct]);

  return { product, loading, error };
}
