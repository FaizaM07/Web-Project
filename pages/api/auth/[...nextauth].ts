import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GithubProvider({
         clientId: process.env.GITHUB_ID as string,
         clientSecret: process.env.GITHUB_SECRET as string,
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error("Invalid credentials");
            }

            const user = await prisma.user.findUnique({
               where: {
                  email: credentials.email,
               },
            });

            if (!user || !user?.hashedPassword) {
               throw new Error("Invalid credentials");
            }

            const isCorrectPassword = await bcrypt.compare(
               credentials.password,
               user.hashedPassword
            );

            if (!isCorrectPassword) {
               throw new Error("Invalid credentials");
            }

            return user;
         },
      }),
   ],
   pages: {
      signIn: "/",
   },
   // Allow linking accounts with the same email address
   // This enables users to sign in with multiple providers using the same email
   debug: process.env.NODE_ENV === "development",
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async signIn({ user, account, profile }) {
         if (!user.email) return false;
         
         // For OAuth providers, automatically link accounts with the same email
         if (account?.provider === "google" || account?.provider === "github") {
            try {
               // Check if a user with this email already exists
               const existingUser = await prisma.user.findUnique({
                  where: { email: user.email },
                  include: { accounts: true }
               });

               if (existingUser) {
                  // Check if this provider is already linked to the user
                  const existingAccount = existingUser.accounts.find(
                     acc => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId
                  );

                  if (!existingAccount) {
                     // Link this OAuth account to the existing user
                     await prisma.account.create({
                        data: {
                           userId: existingUser.id,
                           type: account.type,
                           provider: account.provider,
                           providerAccountId: account.providerAccountId,
                           access_token: account.access_token,
                           refresh_token: account.refresh_token,
                           expires_at: account.expires_at,
                           token_type: account.token_type,
                           scope: account.scope,
                           id_token: account.id_token,
                        }
                     });
                     console.log(`Linked ${account.provider} account to existing user: ${user.email}`);
                  }
               }
               return true;
            } catch (error) {
               console.error("Error linking OAuth account:", error);
               return true; // Still allow login, NextAuth will handle it
            }
         }
         return true;
      },
      async session({ session, token }) {
         return session;
      },
   },
   events: {
      async linkAccount({ user, account, profile }) {
         // Account successfully linked
         console.log(`Account ${account.provider} linked to user ${user.email}`);
      },
   },
   secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
