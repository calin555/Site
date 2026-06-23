import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/RegisterForm";

export const metadata: Metadata = {
  title: "Înregistrare",
  description: "Creează un cont ChargePro.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
