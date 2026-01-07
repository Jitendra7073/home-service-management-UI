"use client";


import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";
import { useUserProfile } from "@/hooks/use-queries";
import ProviderBlockScreen from "@/components/ProviderBlockScreen";

import { usePathname } from "next/navigation";

function ProviderLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUserProfile();

  console.log("user",user)
  const pathname = usePathname();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; 
  }

  if (user?.user?.role === "provider" && user?.user?.businessProfile) {
    const business = user.user.businessProfile;
    console.log("business",business)
    
    if (business.isRestricted) {
       return <ProviderBlockScreen status="restricted" reason={business.restrictionReason} />;
    } else if (business.isRejected) {
       return <ProviderBlockScreen status="rejected" reason={business.rejectionReason} />;
    } else if (!business.isApproved) {
       // 2. Pending Block: Only block if accessing Dashboard routes
       if (pathname.startsWith("/provider/dashboard")) {
          return <ProviderBlockScreen status="pending" />;
       }
    }
  }

  return (
      <>
        <GetFcmToken />
        <FirebaseForegroundListener />
        <main className="w-full ">{children}</main>
      </>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProviderLayoutContent>{children}</ProviderLayoutContent>
  );
}
