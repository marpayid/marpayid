
import { NextResponse } from 'next/server';

/**
 * API Route to check SanPay status manually
 * Action: check_status
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    const apiKey = process.env.SANPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SANPAY_API_KEY is not configured' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('action', 'check_status');
    params.append('api_key', apiKey);
    params.append('mitra_reference', orderId);

    const response = await fetch('https://pay.sanpay.id/openapi.php', {
      method: 'POST',
      body: params,
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
