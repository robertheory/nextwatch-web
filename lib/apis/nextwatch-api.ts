import { Show, WatchedEpisode } from '@/types';
import { defaultHeaders } from '.';
import { Statuses } from '../constants';

const BASE_URL = process.env.API_URL || 'http://localhost:3333';

const NEXTWATCH_API = {
  BASE_URL,
  SHOWS: `${BASE_URL}/shows`,
};

const fetchShows = async (status?: string): Promise<Show[]> => {
  const url = new URL(NEXTWATCH_API.SHOWS);
  if (status) {
    url.searchParams.append('status', status);
  }

  const response = await fetch(url.toString(), {
    headers: defaultHeaders
  });

  if (!response.ok) {
    throw new Error('Failed to fetch shows');
  }
  return response.json();
}

const getShowById = async (showId: number): Promise<Show | null> => {
  const response = await fetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
    headers: defaultHeaders
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

type CreateShowData = {
  showId: number;
  status?: Statuses;
};

const registerShow = async (showData: CreateShowData): Promise<Show> => {
  const response = await fetch(NEXTWATCH_API.SHOWS, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(showData),
  });
  if (!response.ok) {
    throw new Error('Failed to register show');
  }
  return response.json();
}

const removeShow = async (showId: number): Promise<void> => {
  const response = await fetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error('Failed to remove show');
  }
}

const updateShowStatus = async (showId: number, status: string): Promise<Show> => {
  const response = await fetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update show status');
  }
  return response.json();
}

const fetchWatcheds = async (showId: number) => {
  const response = await fetch(`${BASE_URL}/watched/${showId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error('Failed to mark episode as watched');
  }

  const data = await response.json() as WatchedEpisode[];

  return data;
}

const markEpisodeAsWatched = async (showId: number, episodeId: number) => {
  const response = await fetch(`${BASE_URL}/watched/${showId}/${episodeId}`, {
    method: 'POST',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error('Failed to mark episode as watched');
  }

  const data = await response.json() as WatchedEpisode;

  return data;
}

const unmarkEpisodeAsWatched = async (showId: number, episodeId: number) => {
  const response = await fetch(`${BASE_URL}/watched/${showId}/${episodeId}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error('Failed to unmark episode as watched');
  }
}

export const nextWatchApi = {
  fetchShows,
  getShowById,
  registerShow,
  removeShow,
  updateShowStatus,
  fetchWatcheds,
  markEpisodeAsWatched,
  unmarkEpisodeAsWatched,
};