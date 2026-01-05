import { Toaster } from "sonner";
import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";
// import NotificationPopupContainer from "@/components/common/notification-popup-container";
// import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <AuthProvider>
            <Toaster position="top-right" richColors />
            {/* <NotificationPopupContainer /> */}
            {children}
            {/* <div id="notification-root" /> */}
          </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
