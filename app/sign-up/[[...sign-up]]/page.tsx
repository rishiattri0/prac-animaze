"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-gray-950 to-blue-950 animate-gradient-x" />

      {/* Glow Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Clerk Sign-Up Card */}
      <div
        className={`transition-all duration-1000 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105 focus:ring-4 focus:ring-sky-400/50",
              card: "bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl p-6 animate-fade-in",
              headerTitle: "text-sky-400 text-2xl font-bold tracking-wide",
              headerSubtitle: "text-gray-400 text-sm mt-1",
              socialButtonsBlockButton:
                "bg-gray-800/70 text-white border border-gray-700 hover:bg-gray-700/90 transition-all rounded-lg transform hover:scale-105",
              socialButtonsBlockButtonText: "text-sm font-medium",
              formFieldLabel: "text-gray-300 font-medium text-sm",
              formFieldInput:
                "bg-gray-800/70 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all",
              footerActionLink:
                "text-sky-400 hover:text-sky-300 hover:underline transition",
            },
            variables: {
              colorPrimary: "#38bdf8",
              colorText: "white",
              colorBackground: "transparent",
              borderRadius: "1rem",
            },
          }}
        />
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 12s ease infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
