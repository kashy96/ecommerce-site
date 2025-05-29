import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthOptions } from "next-auth";
import { LOGIN_URL } from "@/lib/constants";

export interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  token: string;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        try {
          const res = await axios.post(`${LOGIN_URL}`, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data?.user;
          if (user && user._id && user.token) {
            return {
              id: user._id,
              name: user.name || null,
              email: user.email || null,
              token: user.token,
              role: user.role || null,
            };
          }
          throw new Error("Invalid credentials");
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as CustomUser;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };