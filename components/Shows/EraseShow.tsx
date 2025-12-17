'use client';

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
import { Button } from '@/components/ui/button';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EraseShow({ showId }: { showId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleErase = async () => {
    setLoading(true);
    try {
      await nextWatchApi.removeShow(showId);
      toast.success('Preferences erased');
      router.push('/shows');
    } catch (err) {
      console.error('Failed to erase preferences', err);
      toast.error('Failed to erase preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Erase
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Erase preferences?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently erase all your preferences for this show. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size='sm'>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              size='sm'
              variant='destructive'
              onClick={handleErase}
              disabled={loading}
            >
              {loading ? 'Erasing...' : 'Yes, erase'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
