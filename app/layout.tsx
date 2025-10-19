import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Padmaisha - B2B Fashion for Retailers',
  description: 'Premium B2B Clothing for Retailers – Exclusive Brands, Affordable Prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-screen min-h-screen overflow-x-hidden">
      <body className={inter.className + " w-screen min-h-screen flex flex-col overflow-x-hidden bg-white"}>
        <AuthProvider>
          <AppProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}