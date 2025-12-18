import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isWorker = nextUrl.pathname.startsWith('/api/worker');
      const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isWorker) return true;

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      if (isDashboard && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login'
  },
} satisfies NextAuthConfig;