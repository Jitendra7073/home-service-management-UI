import type { Metadata } from "next";
import TanstackProvider from "../../tanstackProvider";
import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

export const metadata: Metadata = {
  title: "HSM | Provider Dashboard",
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
      <main className="w-full ">{children}</main>
    </TanstackProvider>
  );
}
