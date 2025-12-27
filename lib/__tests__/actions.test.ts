import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMonitorAction, deleteMonitorAction, toggleMonitorAction, registerUserAction, authenticateAction } from '../actions';
import { auth, signIn } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

describe('Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createMonitorAction', () => {
        it('should return error if unauthorized', async () => {
            vi.mocked(auth).mockResolvedValueOnce(null as unknown as any);
            const formData = new FormData();
            formData.append('name', 'Test');
            formData.append('url', 'https://example.com');

            const result = await createMonitorAction({ message: null }, formData);

            expect(result.message?._server).toContain('Unauthorized. Please login to create a monitor.');
        });

        it('should return error if validation fails', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            const formData = new FormData();
            formData.append('name', '');
            formData.append('url', 'invalid-url');

            const result = await createMonitorAction({ message: null }, formData);

            expect(result.message).toHaveProperty('name');
            expect(result.message).toHaveProperty('url');
        });

        it('should create monitor and revalidate path on success', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            vi.mocked(prisma.monitor.create).mockResolvedValueOnce({} as any);

            const formData = new FormData();
            formData.append('name', 'My Monitor');
            formData.append('url', 'https://google.com');

            const result = await createMonitorAction({ message: null }, formData);

            expect(result.message).toBeNull();
            expect(prisma.monitor.create).toHaveBeenCalledWith({
                data: {
                    name: 'My Monitor',
                    url: 'https://google.com',
                    status: 'PENDING',
                    userId: 'user-1',
                },
            });
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
        });

        it('should return error on database failure', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            vi.mocked(prisma.monitor.create).mockRejectedValueOnce(new Error('DB Error'));

            const formData = new FormData();
            formData.append('name', 'Test');
            formData.append('url', 'https://example.com');

            const result = await createMonitorAction({ message: null }, formData);

            expect(result.message?._server).toContain('Could not create the monitor.');
        });
    });

    describe('deleteMonitorAction', () => {
        it('should return error if unauthorized', async () => {
            vi.mocked(auth).mockResolvedValueOnce(null as unknown as any);
            const result = await deleteMonitorAction('monitor-1');
            expect(result?.message).toBe('Unauthorized');
        });

        it('should delete monitor and revalidate path on success', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            vi.mocked(prisma.monitor.delete).mockResolvedValueOnce({} as any);

            await deleteMonitorAction('monitor-1');

            expect(prisma.monitor.delete).toHaveBeenCalledWith({
                where: { id: 'monitor-1', userId: 'user-1' },
            });
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
        });

        it('should return error on failure', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            vi.mocked(prisma.monitor.delete).mockRejectedValueOnce(new Error('Fail'));

            const result = await deleteMonitorAction('monitor-1');
            expect(result?.message).toBe('Database Error: Failed to Delete Monitor.');
        });
    });

    describe('toggleMonitorAction', () => {
        it('should toggle status', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any);
            vi.mocked(prisma.monitor.update).mockResolvedValueOnce({} as any);

            await toggleMonitorAction('monitor-1', true);

            expect(prisma.monitor.update).toHaveBeenCalledWith({
                where: { id: 'monitor-1', userId: 'user-1' },
                data: { active: false },
            });
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('registerUserAction', () => {
        it('should return error if validation fails', async () => {
            const formData = new FormData();
            formData.append('name', 'a');
            formData.append('email', 'invalid');
            formData.append('password', '123');

            const result = await registerUserAction({ message: null }, formData);
            expect(result.message).toHaveProperty('name');
            expect(result.message).toHaveProperty('email');
            expect(result.message).toHaveProperty('password');
        });

        it('should return error if user already exists', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: '1' } as any);
            const formData = new FormData();
            formData.append('name', 'John');
            formData.append('email', 'test@example.com');
            formData.append('password', 'password123');

            const result = await registerUserAction({ message: null }, formData);
            expect(result.message?.email).toContain('Email already in use.');
        });

        it('should register user on success', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
            vi.mocked(prisma.user.create).mockResolvedValueOnce({} as any);

            const formData = new FormData();
            formData.append('name', 'John');
            formData.append('email', 'test@example.com');
            formData.append('password', 'password123');

            const result = await registerUserAction({ message: null }, formData);
            expect(result.success).toBe(true);
            expect(prisma.user.create).toHaveBeenCalled();
        });
    });

    describe('authenticateAction', () => {
        it('should call signIn with credentials', async () => {
            const formData = new FormData();
            formData.append('email', 'test@test.com');
            formData.append('password', 'password');

            await authenticateAction(undefined, formData);

            expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
                email: 'test@test.com',
                password: 'password',
            }));
        });
    });
});
