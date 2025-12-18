'use client';

import { EpisodesBySeason } from '@/app/shows/[id]/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function EpisodesList({
  episodes,
  showId,
}: {
  episodes: EpisodesBySeason;
  showId?: number;
}) {
  const [localEpisodes, setLocalEpisodes] =
    useState<EpisodesBySeason>(episodes);
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLocalEpisodes(() => episodes);
  }, [episodes]);

  const setEpisodeWatchedAt = (
    season: number,
    episodeId: number,
    watchedAt: string | null
  ) => {
    setLocalEpisodes((prev) => {
      const next = { ...prev } as EpisodesBySeason;
      next[season] = next[season].map((e) =>
        e.id === episodeId ? { ...e, watchedAt } : e
      );
      return next;
    });
  };

  const setLoading = (episodeId: number, v: boolean) =>
    setLoadingMap((prev) => ({ ...prev, [episodeId]: v }));

  const handleMarkWatched = async (season: number, episodeId: number) => {
    if (!showId) return;
    setLoading(episodeId, true);
    try {
      const res = await nextWatchApi.markEpisodeAsWatched(showId, episodeId);
      // assume API returns WatchedEpisode with watchedAt
      setEpisodeWatchedAt(
        season,
        episodeId,
        res.watchedAt ? res.watchedAt : null
      );
    } catch (err) {
      console.error('Failed to mark watched', err);
    } finally {
      setLoading(episodeId, false);
    }
  };

  const handleUnmarkWatched = async (season: number, episodeId: number) => {
    if (!showId) return;
    setLoading(episodeId, true);
    try {
      await nextWatchApi.unmarkEpisodeAsWatched(showId, episodeId);
      setEpisodeWatchedAt(season, episodeId, null);
    } catch (err) {
      console.error('Failed to unmark watched', err);
    } finally {
      setLoading(episodeId, false);
    }
  };

  const seasons = Object.keys(localEpisodes)
    .map((s) => Number(s))
    .sort((a, b) => a - b);

  return (
    <section>
      <h3 className='text-lg font-semibold mb-3'>Episodes</h3>
      <div className='space-y-6'>
        {seasons.map((season) => {
          const eps = localEpisodes[season] || [];
          const epsSorted = eps
            .slice()
            .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
          return (
            <div key={season} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-md font-semibold'>Season {season}</h4>
                <div className='text-sm text-muted-foreground'>
                  {epsSorted.length} episode{epsSorted.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className='space-y-3'>
                {epsSorted.map((ep) => (
                  <Card key={ep.id} className='p-3'>
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
                              S{String(ep.season).padStart(2, '0')} • E
                              {ep.number ?? '–'} • {ep.airdate ?? '—'} •{' '}
                              {ep.runtime ?? '—'}m • Rating:{' '}
                              {ep.rating?.average ?? '—'}
                            </div>
                            {ep.watchedAt && (
                              <div className='text-xs text-muted-foreground mt-1'>
                                Watched:{' '}
                                {new Date(ep.watchedAt).toLocaleString()}
                              </div>
                            )}
                          </div>

                          <div className='shrink-0'>
                            {!ep.watchedAt ? (
                              <Button
                                size='sm'
                                variant='default'
                                onClick={() => handleMarkWatched(season, ep.id)}
                                type='button'
                                disabled={!!loadingMap[ep.id]}
                              >
                                {loadingMap[ep.id] ? '...' : 'Mark watched'}
                              </Button>
                            ) : (
                              <Button
                                size='sm'
                                variant='secondary'
                                onClick={() =>
                                  handleUnmarkWatched(season, ep.id)
                                }
                                type='button'
                                disabled={!!loadingMap[ep.id]}
                              >
                                {loadingMap[ep.id] ? '...' : 'Unwatch'}
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
