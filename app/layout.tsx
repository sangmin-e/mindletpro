import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINDLET PRO",
  description: "상민의 메모보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
