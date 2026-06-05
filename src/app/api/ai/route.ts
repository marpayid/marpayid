import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Menggunakan model stabil & cepat
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah CS AI MarPay. MarPay adalah toko digital dan marketplace kecil yang menjual PPOB, pulsa, e-wallet, PLN token, produk digital, dan produk fisik. Jawab singkat, ramah, jelas, dan arahkan pembeli ke WhatsApp admin jika ingin order. Jangan mengaku bisa memproses pembayaran otomatis. Kalau ditanya order, arahkan untuk klik tombol WhatsApp admin atau hubungi 083851278935.'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({ 
      content: response.choices[0].message.content 
    });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses permintaan AI.' }, 
      { status: 500 }
    );
  }
}