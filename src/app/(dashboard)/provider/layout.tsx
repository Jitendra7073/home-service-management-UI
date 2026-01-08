"use client";

import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

function ProviderLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GetFcmToken />
      <FirebaseForegroundListener />

      <main className="w-full">{children}</main>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProviderLayoutContent>{children}</ProviderLayoutContent>;
}
