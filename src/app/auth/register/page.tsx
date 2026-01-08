import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account securely.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
