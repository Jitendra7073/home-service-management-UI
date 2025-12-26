import type { Metadata } from "next";
import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import TanstackProvider from "../../tanstackProvider";
import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

export const metadata: Metadata = {
  title: "HSM | Customer",
  description: "description not yet created",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      <GetFcmToken />
      <FirebaseForegroundListener />
      <main className="min-h-screen flex flex-col justify-between">
        <Header />
        {children}
        <Footer />
      </main>
    </TanstackProvider>
  );
}
