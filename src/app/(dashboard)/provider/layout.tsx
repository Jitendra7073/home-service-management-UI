import type { Metadata } from "next";
import TanstackProvider from "../../tanstackProvider";

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

      <main className="w-full ">{children}</main>
    </TanstackProvider>
  );
}
