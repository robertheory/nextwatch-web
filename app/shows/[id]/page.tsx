/* eslint-disable @next/next/no-img-element */
import EpisodesList from '@/components/EpisodesList';
import EraseShow from '@/components/Shows/EraseShow';
import ShowStatusSelector from '@/components/Shows/ShowStatusSelector';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { tvMazeApi } from '@/lib/apis/tvmaze-api';
import { ShowStatus } from '@/lib/constants';
import { TVMazeEpisodeExtended } from '@/types/tvmaze';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

export type EpisodesBySeason = Record<number, TVMazeEpisodeExtended[]>;

export default async function Page({ params }: Props) {
  const { id } = await params;

  if (Number.isNaN(Number(id)) || Number(id) <= 0) {
    notFound();
  }

  const show = await tvMazeApi.fetchShowByTvMazeId(Number(id));

  if (!show) notFound();

  const episodesData = await tvMazeApi.fetchShowEpisodes(Number(id));

  const myWatchedEpisodes = await nextWatchApi.fetchWatcheds(Number(id));

  const episodes = episodesData.reduce((acc, episode) => {
    const season = episode.season || 0;
    if (!acc[season]) {
      acc[season] = [];
    }

    const watchedEpisode = myWatchedEpisodes.find(
      (we) => we.episodeId === episode.id
    );

    acc[season].push({
      ...episode,
      watchedAt: watchedEpisode?.watchedAt || null,
    });
    return acc;
  }, {} as EpisodesBySeason);

  const showPreferences = await nextWatchApi.getShowById(Number(id));

  const status = showPreferences?.status || null;

  return (
    <main className='container mx-auto py-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-start gap-4'>
              <div className='w-36 h-48 shrink-0 overflow-hidden rounded-md bg-muted'>
                {show.image ? (
                  <img
                    src={show.image.original ?? show.image.medium}
                    alt={show.name}
                    width={360}
                    height={480}
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-sm text-muted-foreground'>
                    No image
                  </div>
                )}
              </div>

              <div className='flex-1 relative'>
                <CardTitle>{show.name}</CardTitle>
                <CardDescription>
                  {show.status || ShowStatus.UNTRACKED} • {show.language} •{' '}
                  {show.genres.join(', ')}
                </CardDescription>
                <div className='mt-2 text-sm text-muted-foreground'>
                  Premiered: {show.premiered ?? '—'}
                </div>
                <div className='mt-3'>
                  <ShowStatusSelector
                    showId={Number(id)}
                    currentStatus={status}
                  />
                </div>

                <div className='absolute right-0 top-0'>
                  <EraseShow showId={Number(id)} />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <section className='prose max-w-none dark:prose-invert'>
              {show.summary ? (
                <div dangerouslySetInnerHTML={{ __html: show.summary }} />
              ) : (
                <p>No summary available.</p>
              )}
            </section>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-semibold'>Network</h4>
                <p className='text-sm text-muted-foreground'>
                  {show.network?.name ?? show.webChannel?.name ?? '—'}
                </p>
              </div>

              <div>
                <h4 className='text-sm font-semibold'>Official site</h4>
                <p className='text-sm text-muted-foreground'>
                  {show.officialSite ? (
                    <a
                      href={show.officialSite}
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary underline'
                    >
                      Visit
                    </a>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className='flex items-center gap-2 w-full'>
              <Link href='/'>
                <Button variant='outline' size='sm' asChild>
                  <button type='button'>Back</button>
                </Button>
              </Link>
              <div className='ml-auto text-sm text-muted-foreground'>
                Rating: {show.rating?.average ?? '—'}
              </div>
            </div>
          </CardFooter>
        </Card>

        <EpisodesList episodes={episodes} showId={Number(id)} />
      </div>
    </main>
  );
}
