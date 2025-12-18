import { Statuses } from '@/lib/constants';

export type Show = {
  id: number;
  showId: number;
  status: Statuses;
  createdAt: string;
  updatedAt: string | null;
};

export type WatchedEpisode = {
  id: number;
  showId: number;
  episodeId: number;
  watchedAt: string | null;
}