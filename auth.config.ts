import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCron = nextUrl.pathname.startsWith('/api/cron');
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isCron) return true;

      if (isDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;