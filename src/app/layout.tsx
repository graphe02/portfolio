import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { asset, SITE_URL } from "@/lib/paths";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Daniel Yi",
    template: "%s — Daniel Yi",
  },
  description: "Daniel Yi",
  openGraph: {
    type: "website",
    siteName: "Daniel Yi",
    title: "Daniel Yi",
    description: "Daniel Yi",
    url: `${SITE_URL}/`,
    images: [`${SITE_URL}/pfp.jpg`],
  },
  twitter: {
    card: "summary",
  },
  icons: {
    icon: asset("/favicon.ico"),
    shortcut: asset("/logo.png"),
    apple: asset("/logo.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
