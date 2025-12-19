import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import GetFcmToken from "./fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

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
        <GetFcmToken />
        <FirebaseForegroundListener />
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
