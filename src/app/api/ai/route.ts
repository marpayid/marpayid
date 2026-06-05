import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * API Route Stub for CS MarPay.
 * Local FAQ logic is now handled on the client side in MarPayAIChat component
 * to ensure 100% stability and free operation.
 */
export async function POST() {
  return NextResponse.json({
    reply: "Sistem AI sedang bermigrasi ke mode lokal. Silakan gunakan chat asisten di halaman akun."
  });
}
