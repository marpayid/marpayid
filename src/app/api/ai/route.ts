import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { reply: "OPENAI_API_KEY belum terbaca di server." },
        { status: 500 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { reply: "Silakan tulis pertanyaan terlebih dahulu." },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Model paling stabil, cepat, dan hemat untuk Chatbot
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah CS AI MarPay. MarPay adalah toko digital dan marketplace kecil yang menjual PPOB, pulsa, e-wallet, PLN token, produk digital, dan produk fisik. Jawab singkat, ramah, jelas, dan arahkan pembeli ke WhatsApp admin jika ingin order. Jangan mengaku bisa memproses pembayaran otomatis. Kalau ditanya order, arahkan untuk klik tombol WhatsApp admin atau hubungi 083851278935."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      reply: response.choices[0].message.content || "Maaf, saya belum bisa menjawab pertanyaan itu."
    });
  } catch (error: any) {
    console.error("MarPay AI error:", error);

    return NextResponse.json(
      {
        reply:
          "Maaf, AI MarPay sedang gangguan. Silakan hubungi admin WhatsApp."
      },
      { status: 500 }
    );
  }
}
