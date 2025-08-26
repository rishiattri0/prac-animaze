"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/logo"; // adjust to your path

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/anime");
    }
  };

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-indigo-900 px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="m-auto w-full max-w-md rounded-2xl border border-indigo-800/40 bg-[#0d1324]/80 backdrop-blur-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-6 border-b border-indigo-800/40">
          <Link href="/" aria-label="Go home">
            <LogoIcon className="h-10 w-10 text-indigo-400 hover:text-indigo-300 transition" />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-indigo-200">
            Create your Animaze Account
          </h1>
          <p className="text-sm text-gray-400">
            Join the Animaze community and start exploring!
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-indigo-700/50 bg-[#10172a]/70 hover:bg-[#1c2340] text-indigo-300"
              onClick={() => signIn("google")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-indigo-700/50 bg-[#10172a]/70 hover:bg-[#1c2340] text-indigo-300"
              onClick={() => signIn("azure-ad")}
            >
              Microsoft
            </Button>
          </div>

          <hr className="border-indigo-700/40" />

          {/* Form inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-300">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#10172a] border-indigo-700/40 text-gray-200 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-indigo-300">
                Password
              </Label>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#10172a] border-indigo-700/40 text-gray-200 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium">{error}</p>
            )}
            <Link href="/anime">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md rounded-lg"
              >
                Continue
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#10172a]/70 border-t border-indigo-800/40 p-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
