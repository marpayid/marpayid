
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'API SanPay sudah dinonaktifkan. Gunakan alur pembayaran manual.' }, { status: 404 });
}
