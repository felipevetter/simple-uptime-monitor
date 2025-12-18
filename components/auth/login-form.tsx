'use client';

import { useFormStatus } from 'react-dom';
import { authenticateAction, githubLoginAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign in with Email'}
    </Button>
  );
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticateAction, undefined);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={githubLoginAction}>
          <Button variant="outline" className="w-full" type="submit">
            <Github className="mr-2 h-4 w-4" />
            GitHub
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

        <form action={dispatch} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          
          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMessage}</p>
            </div>
          )}
          
          <LoginButton />
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground w-full text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline hover:text-primary">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}