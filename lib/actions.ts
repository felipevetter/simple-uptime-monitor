'use server';

import { auth, signIn } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

const CreateMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type ActionState = {
  message: {
    _server?: string[];
    [key: string]: string[] | string | undefined;
  } | null;
  success?: boolean;
};

export async function createMonitorAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: { _server: ['Unauthorized. Please login to create a monitor.'] },
    };
  }

  const validatedFields = CreateMonitorSchema.safeParse({
    name: formData.get('name'),
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.monitor.create({
      data: {
        name: validatedFields.data.name,
        url: validatedFields.data.url,
        status: 'PENDING',
        userId: session.user.id,
      },
    });
    revalidatePath('/dashboard');
    return { message: null };
  } catch {
    return {
      message: { _server: ['Could not create the monitor.'] },
    };
  }
}

export async function deleteMonitorAction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: 'Unauthorized',
    };
  }

  try {
    await prisma.monitor.delete({
      where: {
        id,
        userId: session.user.id
      },
    });
    revalidatePath('/dashboard');
  } catch {
    return {
      message: 'Database Error: Failed to Delete Monitor.',
    };
  }
}

export async function toggleMonitorAction(id: string, currentStatus: boolean) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: 'Unauthorized',
    };
  }

  try {
    await prisma.monitor.update({
      where: {
        id,
        userId: session.user.id
      },
      data: { active: !currentStatus },
    });
    revalidatePath('/dashboard');
  } catch {
    return {
      message: 'Database Error: Failed to toggle monitor status.',
    };
  }
}

export async function registerUserAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: { email: ['Email already in use.'] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Não fazemos login automático aqui por segurança/simplicidade, 
    // redirecionamos para login na UI após sucesso.
    return { success: true, message: null };
  } catch {
    return {
      message: { _server: ['Something went wrong. Please try again.'] },
    };
  }
}

export async function authenticateAction(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function githubLoginAction() {
  await signIn('github', { redirectTo: '/dashboard' });
}