'use client';

import { useFormStatus } from 'react-dom';
import { registerUserAction, githubLoginAction, ActionState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const initialState = {
  message: null as ActionState['message'],
  success: false,
};

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUserAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success('Account created! Please log in.');
      router.push('/login');
    }
  }, [state.success, router]);

  const errors = state.message && typeof state.message === 'object' && !('_server' in state.message) 
    ? state.message 
    : {};
  
  let serverError = '';
  if (state.message && typeof state.message === 'object' && '_server' in state.message) {
    serverError = state.message._server?.[0] || '';
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create an account to start monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={githubLoginAction}>
           <Button variant="outline" className="w-full" type="submit">
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className={errors.email ? 'border-red-500' : ''} />
            {errors.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className={errors.password ? 'border-red-500' : ''} />
            {errors.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <RegisterButton />
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground w-full text-center">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}