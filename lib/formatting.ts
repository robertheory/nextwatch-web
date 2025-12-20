import { ExtendedShow } from '@/app/shows/page';
import { Show } from '@/types';
import { nextWatchApi } from './apis/nextwatch-api';
import { tvMazeApi } from './apis/tvmaze-api';
import { Statuses } from './constants';

export const combineShowData = async (statusFilter?: Statuses) => {
  const myShowData: Show[] = await nextWatchApi.fetchShows(statusFilter);

  const shows: ExtendedShow[] = [];

  for (const entry of myShowData) {
    const remote = await tvMazeApi.fetchShowByTvMazeId(entry.showId);
    shows.push({ ...remote, status: entry.status ?? 'UNTRACKED' });
  }

  return shows;
};