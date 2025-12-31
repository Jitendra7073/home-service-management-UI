import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Fixora",
  description: "Create a new account securely with Fixora.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
