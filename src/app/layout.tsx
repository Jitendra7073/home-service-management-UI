import type { Metadata } from "next";
import { Toaster } from "sonner";
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
      <body>
        <div className="">
          <Toaster position="top-right" richColors />
        </div>
        {children}
      </body>
    </html>
  );
}
