import { nextWatchApi } from '@/lib/apis/nextwatch-api';
import { tvMazeApi } from '@/lib/apis/tvmaze-api';
import { ShowStatus, Statuses } from '@/lib/constants';
import { Show } from '@/types';
import { TVMazeShow } from '@/types/tvmaze';
import ShowsList from './ShowsList';

export const dynamic = 'force-dynamic';

export interface ExtendedShow extends TVMazeShow {
  status: string;
}

const MyShows = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const paramsStatus = params.status as string | undefined;

  let statusFilter: Statuses | undefined = undefined;

  if (paramsStatus && paramsStatus in ShowStatus) {
    statusFilter = paramsStatus as Statuses;
  }

  const myShowData: Show[] = await nextWatchApi.fetchShows(statusFilter);

  const shows: ExtendedShow[] = [];

  for (const entry of myShowData) {
    const remote = await tvMazeApi.fetchShowByTvMazeId(entry.showId);
    shows.push({ ...remote, status: entry.status ?? 'UNTRACKED' });
  }

  return (
    <main className='w-full container mx-auto py-8'>
      <h1 className='text-2xl font-semibold mb-6'>My Shows</h1>

      <ShowsList shows={shows} />
    </main>
  );
};

export default MyShows;
