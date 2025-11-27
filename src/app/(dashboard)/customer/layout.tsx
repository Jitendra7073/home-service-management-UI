import type { Metadata } from "next";
import Header from "@/components/customer/Header";

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
        <Header />

        {children}
      </body>
    </html>
  );
}
