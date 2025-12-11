import type { Metadata } from "next";
import Header from "@/components/customer/Header";
import TanstackProvider from "./tanstackProvider";

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
    <html lang="en">
      <body>
        <TanstackProvider>
          <main className="min-h-screen flex flex-col justify-between">
            {children}
          </main>
        </TanstackProvider>
      </body>
    </html>
  );
}
