'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { ShowStatus, Statuses } from '@/lib/constants';
import { useState } from 'react';

export default function ShowStatusSelector({
  showId,
  currentStatus,
}: {
  showId: number;
  currentStatus: Statuses | null;
}) {
  const enumKeys = Object.keys(ShowStatus).filter((k) => isNaN(Number(k)));

  const displayMap: Record<Statuses, string> = {
    NOT_STARTED: 'Not started',
    WATCHING: 'Watching',
    FINISHED: 'Finished',
    UNTRACKED: 'Untracked',
  };

  const [status, setStatus] = useState<Statuses>(currentStatus || 'UNTRACKED');

  const handleRegisterShow = async (value: Statuses) => {
    try {
      await nextWatchApi.registerShow({
        showId,
        status: value,
      });
    } catch (err) {
      console.error('Failed to register show', err);
    }
  };

  const handleChange = async (value: Statuses) => {
    const prev = status;
    setStatus(value);
    try {
      if (!currentStatus) {
        await handleRegisterShow(value as Statuses);
        return;
      }

      await nextWatchApi.updateShowStatus(showId, value);
    } catch (err) {
      console.error('Failed to update show status', err);
      setStatus(prev);
    }
  };

  return (
    <div className='inline-block'>
      {!currentStatus && (
        <span className='mr-2 text-sm text-muted-foreground'>
          Start tracking:
        </span>
      )}

      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger size='sm' className='min-w-48'>
          <SelectValue>{displayMap[status] ?? status}</SelectValue>
        </SelectTrigger>

        <SelectContent>
          {enumKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {displayMap[key as Statuses] ?? key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
