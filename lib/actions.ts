'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

export async function createMonitorAction(prevState: any, formData: FormData) {
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
      },
    });
    revalidatePath('/');
    return { message: null };
  } catch (error) {
    return {
      message: { _server: ['Não foi possível criar o monitor.'] },
    };
  }
}

export async function deleteMonitorAction(id: string) {
  try {
    await prisma.monitor.delete({
      where: { id },
    });
    revalidatePath('/');
  } catch (error) {
    return {
      message: 'Database Error: Não foi possível deletar o monitor.',
    };
  }
}

export async function toggleMonitorAction(id: string, currentStatus: boolean) {
  try {
    await prisma.monitor.update({
      where: { id },
      data: { active: !currentStatus },
    });
    revalidatePath('/');
  } catch (error) {
    return {
      message: 'Database Error: Não foi possível alterar o status do monitor.',
    };
  }
}