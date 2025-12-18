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
import Image from 'next/image';
import Link from 'next/link';

const MyShows = async () => {
  const myShowData = await nextWatchApi.fetchShows();

  const shows = await Promise.all(
    myShowData.map(async (entry) => {
      const remote = await tvMazeApi.fetchShowByTvMazeId(entry.showId);
      return { local: entry, remote };
    })
  );

  if (shows.length === 0) {
    return (
      <main className='container mx-auto py-8'>
        <p className='text-center text-muted-foreground'>
          You have no shows in your collection.
        </p>
      </main>
    );
  }

  return (
    <main className='w-full container mx-auto py-8'>
      <h1 className='text-2xl font-semibold mb-6'>My Shows</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {shows.map(({ local, remote }) => (
          <Card key={remote.id} className='overflow-hidden'>
            <CardHeader>
              <div className='flex gap-4 items-start'>
                <div className='w-24 h-32 shrink-0 overflow-hidden rounded-md bg-muted'>
                  {remote.image ? (
                    <Image
                      src={remote.image.medium}
                      alt={remote.name}
                      width={160}
                      height={220}
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
                      No image
                    </div>
                  )}
                </div>

                <div className='flex-1'>
                  <CardTitle className='text-base'>{remote.name}</CardTitle>
                  <CardDescription className='text-sm'>
                    {remote.genres?.length ? remote.genres.join(', ') : '—'}
                  </CardDescription>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    {remote.premiered
                      ? new Date(remote.premiered).getFullYear()
                      : '—'}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p
                suppressHydrationWarning
                className='text-sm text-muted-foreground line-clamp-3'
                dangerouslySetInnerHTML={{ __html: remote.summary ?? '' }}
              />
            </CardContent>

            <CardFooter>
              <div className='w-full flex items-center gap-2'>
                <Link href={`/shows/${remote.id}`}>
                  <Button size='sm'>Details</Button>
                </Link>

                <div className='ml-auto text-xs text-muted-foreground'>
                  Status: {local.status ?? '—'}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default MyShows;
