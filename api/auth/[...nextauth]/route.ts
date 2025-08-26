import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your DB call
        if (
          credentials?.email === "test@example.com" &&
          credentials.password === "password123"
        ) {
          return { id: "1", name: "Test User", email: "test@example.com" };
        }

        return null; // null = invalid credentials
      },
    }),
  ],
  pages: {
    signIn: "/signin", // tell NextAuth to use your shadcn signin page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
