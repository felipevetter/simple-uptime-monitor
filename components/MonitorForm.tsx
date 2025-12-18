'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createMonitorAction, type ActionState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';


const initialState: ActionState = {
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Monitor'}
    </Button>
  );
}

export default function MonitorForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createMonitorAction, initialState);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state.message === null && success) {
      toast.success('Monitor created successfully!');
      startTransition(() => {
        setOpen(false);
        setSuccess(false);
      });
    } else if (state.message && typeof state.message === 'object' && '_server' in state.message) {
      toast.error(state.message?._server?.[0]);
    }
  }, [state, success]);

  // Use a local variable to help TypeScript with narrowing
  const stateMessage = state.message;
  const errors = stateMessage && typeof stateMessage === 'object' && !('_server' in stateMessage)
    ? stateMessage
    : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Monitor</DialogTitle>
          <DialogDescription>
            Enter the details of the website you want to track.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(payload) => {
            setSuccess(true);
            formAction(payload);
          }}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors?.name ? 'text-red-500' : ''}>
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="My Website"
              className={errors?.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors?.name && Array.isArray(errors.name) && (
              <p className="text-xs text-red-500">{errors.name[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className={errors?.url ? 'text-red-500' : ''}>
              URL
            </Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com"
              type="url"
              className={errors?.url ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors?.url && Array.isArray(errors.url) && (
              <p className="text-xs text-red-500">{errors.url[0]}</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}