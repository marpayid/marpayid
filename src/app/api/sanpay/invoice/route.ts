
import { NextResponse } from 'next/server';

/**
 * API Route to create SanPay Invoice
 * Action: create_invoice
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, method, customerName, customerPhone } = body;

    const apiKey = process.env.SANPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SANPAY_API_KEY is not configured' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('action', 'create_invoice');
    params.append('api_key', apiKey);
    params.append('method', method === 'qris' ? 'QRIS' : 'BT'); // BT for Bank Transfer
    params.append('amount', amount.toString());
    params.append('mitra_reference', orderId);
    params.append('customer_name', customerName);
    params.append('customer_phone', customerPhone);

    const response = await fetch('https://pay.sanpay.id/openapi.php', {
      method: 'POST',
      body: params,
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.message || 'Failed to create invoice' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
