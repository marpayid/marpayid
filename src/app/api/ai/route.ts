import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { reply: "OPENAI_API_KEY belum terbaca di server." },
        { status: 500 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Silakan tulis pertanyaan terlebih dahulu." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah CS AI MarPay. MarPay adalah toko digital dan marketplace kecil yang menjual PPOB, pulsa, e-wallet, PLN token, produk digital, dan produk fisik. Jawab singkat, ramah, jelas, dan arahkan pembeli ke WhatsApp admin jika ingin order. Jangan mengaku bisa memproses pembayaran otomatis."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.4
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Maaf, saya belum bisa menjawab pertanyaan itu.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("MarPay AI error detail:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type
    });

    return NextResponse.json(
      {
        reply:
          "Maaf, AI MarPay sedang gangguan. Silakan hubungi admin WhatsApp."
      },
      { status: 500 }
    );
  }
}
