'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

export async function createMonitorAction(prevState: any, formData: FormData) {
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
    revalidatePath('/');
    return { message: null };
  } catch (error) {
    return {
      message: { _server: ['Could not create the monitor.'] },
    };
  }
}

export async function deleteMonitorAction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: 'Unauthorized' };
  }

  try {
    // Usar deleteMany permite passar userId no where para segurança
    await prisma.monitor.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Monitor.' };
  }
}

export async function toggleMonitorAction(id: string, currentStatus: boolean) {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: 'Unauthorized' };
  }

  try {
    // Usar updateMany permite passar userId no where
    await prisma.monitor.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: { active: !currentStatus },
    });
    revalidatePath('/');
  } catch (error) {
    return { message: 'Database Error: Failed to toggle monitor status.' };
  }
}