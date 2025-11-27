import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Service management app",
  description: "description not yet created",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
