import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'MarPay Marketplace',
  description: 'Belanja Lebih Mudah Dengan MarPay. Semua Kebutuhan Digital Dalam Satu Tempat. Pulsa, Paket Data, Token PLN, E-Wallet, Top Up Game, dan Tagihan Internet.',
  openGraph: {
    title: 'MarPay Marketplace',
    description: 'Belanja Lebih Mudah Dengan MarPay. Semua Kebutuhan Digital Dalam Satu Tempat. Pulsa, Paket Data, Token PLN, E-Wallet, Top Up Game, dan Tagihan Internet.',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
