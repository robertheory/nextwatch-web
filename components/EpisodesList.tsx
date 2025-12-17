'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { TVMazeEpisode } from '@/types/tvmaze';
import Image from 'next/image';

export default function EpisodesList({
  episodes,
  showId,
}: {
  episodes: TVMazeEpisode[];
  showId?: number;
}) {
  const handleMarkWatched = (episodeId: number) => {
    // Implement mark watched functionality here
    console.log(`Marking episode ${episodeId} as watched for show ${showId}`);
  };

  const episodesGroupedBySeason = episodes.reduce((acc, episode) => {
    const season = episode.season || 0;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {} as Record<number, TVMazeEpisode[]>);

  const seasons = Object.keys(episodesGroupedBySeason)
    .map((s) => Number(s))
    .sort((a, b) => a - b);

  return (
    <section>
      <h3 className='text-lg font-semibold mb-3'>Episodes</h3>
      <div className='space-y-6'>
        {seasons.map((season) => {
          const eps = episodesGroupedBySeason[season] || [];
          const epsSorted = eps
            .slice()
            .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
          return (
            <div key={season} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-md font-semibold'>Season {season}</h4>
                <div className='text-sm text-muted-foreground'>
                  {epsSorted.length} episode
                  {epsSorted.length !== 1 ? 's' : ''}
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
                          </div>

                          <div className='shrink-0'>
                            <Button
                              size='sm'
                              variant='default'
                              onClick={() => handleMarkWatched(ep.id)}
                              type='button'
                            >
                              Mark watched
                            </Button>
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
