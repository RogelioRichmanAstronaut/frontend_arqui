import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppWrapper } from '@/components/app-wrapper';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trip-In | Planea tu viaje ideal',
  description: 'Plataforma web de agencia de viajes. Encuentra paquetes, vuelos y hoteles al mejor precio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppWrapper>{children}</AppWrapper>
        <Toaster />
      </body>
    </html>
  );
}
