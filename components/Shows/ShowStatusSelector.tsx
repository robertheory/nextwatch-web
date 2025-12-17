'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { ShowStatus } from '@/lib/constants';
import { useState } from 'react';

export default function ShowStatusSelector({
  showId,
  currentStatus,
}: {
  showId: number;
  currentStatus: string | null;
}) {
  const enumKeys = Object.keys(ShowStatus).filter((k) => isNaN(Number(k)));

  const displayMap: Record<string, string> = {
    NOT_STARTED: 'Not started',
    WATCHING: 'Watching',
    FINISHED: 'Finished',
    UNTRACKED: 'Untracked',
  };

  const [status, setStatus] = useState<string>(currentStatus ?? 'UNTRACKED');

  const handleChange = async (value: string) => {
    const prev = status;
    setStatus(value);
    try {
      await nextWatchApi.updateShowStatus(showId, value);
    } catch (err) {
      console.error('Failed to update show status', err);
      setStatus(prev);
    }
  };

  return (
    <div className='inline-block'>
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger size='sm' className='min-w-48'>
          <SelectValue>{displayMap[status] ?? status}</SelectValue>
        </SelectTrigger>

        <SelectContent>
          {enumKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {displayMap[key] ?? key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
