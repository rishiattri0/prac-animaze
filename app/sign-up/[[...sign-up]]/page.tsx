"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-black via-gray-950 to-blue-950 px-4 py-16 md:py-32">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-900/30 transition-all",
            card: "bg-gray-900/80 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl",
            headerTitle: "text-sky-400 text-2xl font-extrabold",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-all rounded-lg",
            socialButtonsBlockButtonText: "text-sm font-medium",
            formFieldLabel: "text-gray-300 font-medium",
            formFieldInput:
              "bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",
            footerActionLink:
              "text-sky-400 hover:text-sky-300 hover:underline transition",
          },
          variables: {
            colorPrimary: "#38bdf8", // Tailwind sky-400
            colorText: "white",
            colorBackground: "transparent",
            borderRadius: "0.75rem", // rounded-xl
          },
        }}
      />
    </section>
  );
}
