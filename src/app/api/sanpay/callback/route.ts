
import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase for API Route
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Webhook for SanPay Payment Callback
 * SanPay will send a POST request to this endpoint
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const mitra_reference = formData.get('mitra_reference')?.toString();
    const status = formData.get('status')?.toString();
    const sanpay_reference = formData.get('reference')?.toString();

    if (!mitra_reference || !status) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    if (status === 'PAID') {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('__name__', '==', mitra_reference));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          paymentStatus: 'Lunas',
          status: 'Dikonfirmasi',
          sanpay_reference: sanpay_reference || 'N/A',
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error: any) {
    console.error('Callback Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
