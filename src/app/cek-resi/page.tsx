
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Search, Copy, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const COURIERS = [
  { id: 'shopee', name: 'Shopee Express' },
  { id: 'jnt', name: 'J&T Express' },
  { id: 'jne', name: 'JNE' },
  { id: 'sicepat', name: 'SiCepat' },
  { id: 'anteraja', name: 'AnterAja' },
  { id: 'ninja', name: 'Ninja Xpress' },
  { id: 'idexpress', name: 'ID Express' },
  { id: 'pos', name: 'POS Indonesia' },
  { id: 'other', name: 'Lainnya' },
];

export default function CekResiPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [resi, setResi] = useState('');
  const [courier, setCourier] = useState('other');
  const [isCopied, setIsCopied] = useState(false);

  const handleTrack = () => {
    if (!resi.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Masukkan nomor resi terlebih dahulu.",
      });
      return;
    }

    // URL cekresi.com mendukung query string untuk nomor resi
    const trackingUrl = `https://cekresi.com/?noresi=${encodeURIComponent(resi.trim())}`;
    window.open(trackingUrl, '_blank');
  };

  const handleCopy = () => {
    if (!resi) return;
    navigator.clipboard.writeText(resi);
    setIsCopied(true);
    toast({
      title: "Berhasil",
      description: "Nomor resi disalin ke clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Cek Resi Pengiriman</h1>
      </header>

      <main className="pt-24 px-4 max-w-md mx-auto space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4 shadow-sm">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Lacak Pesanan Anda</h2>
          <p className="text-xs text-gray-500 font-medium px-6 leading-relaxed">
            Masukkan nomor resi yang Anda dapatkan dari Admin MarPay untuk memantau status pengiriman.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pilih Kurir (Opsional)</Label>
            <Select value={courier} onValueChange={setCourier}>
              <SelectTrigger className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:ring-primary/20">
                <SelectValue placeholder="Pilih Kurir" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                {COURIERS.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="rounded-xl py-3 text-sm focus:bg-primary/5 focus:text-primary">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor Resi</Label>
            <div className="relative">
              <Input 
                placeholder="Contoh: JP1234567890" 
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                className="rounded-2xl h-14 border-gray-100 bg-gray-50/50 text-lg font-bold pr-12 focus-visible:ring-primary/20"
              />
              <button 
                onClick={handleCopy}
                disabled={!resi}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all active:scale-90",
                  resi ? "text-primary hover:bg-primary/10" : "text-gray-300 cursor-not-allowed"
                )}
              >
                {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleTrack}
              className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Search className="w-5 h-5" />
              Lacak Pengiriman
            </Button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] text-blue-700 font-bold uppercase tracking-tight">Informasi Pelacakan</p>
            <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
              Data status pengiriman disediakan oleh pihak ekspedisi. Pastikan nomor resi sudah aktif (biasanya 1x24 jam setelah dikirim).
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-gray-400 font-medium">
            Mengalami kendala? <button onClick={() => router.push('/akun/bantuan')} className="text-primary font-bold hover:underline">Hubungi Admin</button>
          </p>
        </div>
      </main>
    </div>
  );
}
