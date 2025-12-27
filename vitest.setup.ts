import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js cache revalidatePath
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
    default: () => ({
        handlers: { GET: vi.fn(), POST: vi.fn() },
        auth: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
    }),
}));

vi.mock('@/auth', () => ({
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/db', () => ({
    prisma: {
        monitor: {
            create: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        ping: {
            createMany: vi.fn(),
        },
    },
}));
