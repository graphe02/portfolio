import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LayoutWrapper } from "@/components/layout-wrapper"

export const metadata: Metadata = {
  title: 'lifeunderday',
  description: 'Daniel\'s Odds & Ends',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/logobg.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico?v=4" type="image/x-icon" />
        <link rel="shortcut icon" href="/logo.png?v=4" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=4" />
      </head>
      <body className="font-body antialiased">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
