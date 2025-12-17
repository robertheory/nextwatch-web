import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchShowByTvMazeId } from '@/lib/tvmaze-api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;

  if (Number.isNaN(Number(id)) || Number(id) <= 0) {
    notFound();
  }

  const show = await fetchShowByTvMazeId(Number(id));

  if (!show) notFound();

  return (
    <main className='container mx-auto py-8'>
      <div className='max-w-4xl mx-auto'>
        <Card>
          <CardHeader>
            <div className='flex items-start gap-4'>
              <div className='w-36 h-48 shrink-0 overflow-hidden rounded-md bg-muted'>
                {show.image ? (
                  <Image
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

              <div>
                <CardTitle>{show.name}</CardTitle>
                <CardDescription>
                  {show.status} • {show.language} • {show.genres.join(', ')}
                </CardDescription>
                <div className='mt-2 text-sm text-muted-foreground'>
                  Premiered: {show.premiered ?? '—'}
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
      </div>
    </main>
  );
}
