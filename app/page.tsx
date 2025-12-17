'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Home = () => <LandingContent />;

const LandingContent = () => (
  <section className='mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 py-24 text-center'>
    <h1 className='text-4xl font-bold tracking-tight text-foreground'>
      Discover what to watch next
    </h1>
    <p className='max-w-2xl text-base text-muted-foreground'>
      Use the search bar above to explore TV shows powered by the TVMaze catalog
      and start building your personal collection in My Shows.
    </p>
    <Card className='w-full max-w-3xl'>
      <CardHeader>
        <CardTitle>How it works</CardTitle>
        <CardDescription>
          Search, explore details, and save the titles that matter to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='list-disc space-y-2 pl-5 text-sm text-muted-foreground'>
          <li>Find shows quickly using the top search bar.</li>
          <li>
            Open the result dropdown to preview synopsis, status, and channels.
          </li>
          <li>
            Navigate to a show detail page and add it to your personal list.
          </li>
        </ul>
      </CardContent>
    </Card>
  </section>
);

export default Home;
