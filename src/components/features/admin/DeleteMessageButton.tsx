'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMessage } from '@/lib/actions/contact.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteMessageButtonProps {
  messageId: string;
}

export default function DeleteMessageButton({ messageId }: DeleteMessageButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const result = await deleteMessage(messageId);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 glass rounded-lg hover:bg-red-500/20 transition-all"
          title="Delete message"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-strong border border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to delete this message? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="glass hover:glass-strong">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}