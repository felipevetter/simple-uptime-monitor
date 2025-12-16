import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCron = nextUrl.pathname.startsWith('/api/cron');
      if (isCron) return true;
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;