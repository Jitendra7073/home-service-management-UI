import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account securely.",
  robots: {
    index: false, // Prevent indexing
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
