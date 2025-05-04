import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({

  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = { 
  title: 'Agent Echo', // Updated App Name
  description: 'A social media feed powered by AI agents.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className}`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
