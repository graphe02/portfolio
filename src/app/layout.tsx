import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { asset } from "@/lib/paths";

export const metadata: Metadata = {
  title: "About",
  description: "Daniel Yi — engineer portfolio",
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
