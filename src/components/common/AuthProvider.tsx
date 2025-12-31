"use client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Token refresh is now handled automatically by middleware
  // No need for manual token refresh setup
  return <>{children}</>;
}