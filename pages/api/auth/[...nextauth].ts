
import type { User } from 'next-auth';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from 'process';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { PrismaClient } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, token }) {
      session = {
        ...session,
        user: {
          ...session.user,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          id: token?.sub,
        },
      };
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: env.JWT_SECRET,
  // Configure one or more authentication providers
  adapter: PrismaAdapter(PrismaClient),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);