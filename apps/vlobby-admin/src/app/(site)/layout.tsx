import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import type { Viewport } from 'next';
import { NavBar } from './_components/navbar';
import { Footer } from './_components/footer';
import { cn } from './lib/utils';

export const metadata: Metadata = {
  title: 'Vlobby | Admin Portal',
  description:
    'Vlobby Admin Portal is a comprehensive management system for vehicle logistics, parking operations, and customer service in the automotive industry.',
  openGraph: {
    images: ['https://proactiv-aceternity.vercel.app/banner.png'],
  },
};

// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
//     { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
//   ],
// };

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ViewTransitions>
    <html lang="en">
      <body className="bg-background antialiased h-screen w-screen flex flex-col overflow-scroll">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
    // </ViewTransitions>
  );
}
