import { LoginForm } from '@/components/auth/login-form';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-xl">
        <Activity className="h-6 w-6 text-primary" />
        <span>Simple Uptime</span>
      </Link>
      <LoginForm />
    </div>
  );
}