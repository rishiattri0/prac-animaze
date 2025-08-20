"use client";
import LoginPage from "@/components/sign-up";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return <LoginPage />;
}
