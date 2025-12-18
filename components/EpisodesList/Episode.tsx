'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { TVMazeEpisodeExtended } from '@/types/tvmaze';
import Image from 'next/image';
import { useState } from 'react';

export default function Episode({
  ep,
  season,
  showId,
  onChange,
}: {
  ep: TVMazeEpisodeExtended;
  season: number;
  showId?: number;
  onChange: (
    season: number,
    episodeId: number,
    watchedAt: string | null
  ) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    if (!showId) return;
    setLoading(true);
    try {
      const res = await nextWatchApi.markEpisodeAsWatched(showId, ep.id);

      onChange(season, ep.id, res.watchedAt);
    } catch (err) {
      console.error('Failed to mark watched', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnmark = async () => {
    if (!showId) return;
    setLoading(true);
    try {
      await nextWatchApi.unmarkEpisodeAsWatched(showId, ep.id);
      onChange(season, ep.id, null);
    } catch (err) {
      console.error('Failed to unmark watched', err);
    } finally {
      setLoading(false);
    }
  };

  const watchedDate = ep.watchedAt
    ? new Date(ep.watchedAt).toLocaleString()
    : null;

  return (
    <Card className='p-3'>
      <div className='flex gap-3'>
        <div className='w-28 h-16 shrink-0 overflow-hidden rounded-sm bg-muted'>
          {ep.image ? (
            <Image
              src={ep.image.medium}
              alt={ep.name}
              width={160}
              height={96}
              className='object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
              No image
            </div>
          )}
        </div>

        <div className='flex-1'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <div className='font-medium'>{ep.name}</div>
              <div className='text-xs text-muted-foreground'>
                S{String(ep.season).padStart(2, '0')} • E{ep.number ?? '–'} •{' '}
                {ep.airdate ?? '—'} • {ep.runtime ?? '—'}m • Rating:{' '}
                {ep.rating?.average ?? '—'}
              </div>
              {ep.watchedAt && (
                <div className='text-xs text-muted-foreground mt-1'>
                  Watched: {new Date(ep.watchedAt).toLocaleString()}
                </div>
              )}
            </div>

            {watchedDate && (
              <div className='text-xs text-muted-foreground shrink-0'>
                Watched: {watchedDate}
              </div>
            )}

            <div className='shrink-0'>
              {!ep.watchedAt ? (
                <Button
                  size='sm'
                  variant='default'
                  onClick={handleMark}
                  disabled={loading}
                >
                  {loading ? '...' : 'Mark watched'}
                </Button>
              ) : (
                <Button
                  size='sm'
                  variant='secondary'
                  onClick={handleUnmark}
                  disabled={loading}
                >
                  {loading ? '...' : 'Unwatch'}
                </Button>
              )}
            </div>
          </div>

          {ep.summary && (
            <div
              className='mt-2 text-sm text-muted-foreground prose max-w-none'
              dangerouslySetInnerHTML={{ __html: ep.summary }}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
