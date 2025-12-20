import { Show, WatchedEpisode } from '@/types';
import { defaultHeaders } from '.';
import { Statuses } from '../constants';

const BASE_URL = process.env.API_URL || 'http://localhost:3333';

const safeFetch = async (input: RequestInfo, init?: RequestInit) => {
  try {
    return await fetch(input, init);
  } catch (err) {
    const error = new Error('Network request failed');
    (error as Error & { cause: unknown }).cause = err;
    throw error;
  }
}

const NEXTWATCH_API = {
  BASE_URL,
  SHOWS: `${BASE_URL}/shows`,
};

const fetchShows = async (status?: Statuses): Promise<Show[]> => {
  const url = new URL(NEXTWATCH_API.SHOWS);

  if (status) {
    url.searchParams.append('status', String(status));
  }

  try {
    const response = await safeFetch(url.toString(), {
      headers: defaultHeaders
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as Show[];

    return data;
  } catch (err) {
    return [];
  }
}

const getShowById = async (showId: number): Promise<Show | null> => {
  try {
    const response = await safeFetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
      headers: defaultHeaders
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (err) {
    return null;
  }
}

type CreateShowData = {
  showId: number;
  status?: Statuses;
};

const registerShow = async (showData: CreateShowData): Promise<Show> => {
  try {
    const response = await safeFetch(NEXTWATCH_API.SHOWS, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(showData),
    });

    if (!response.ok) {
      throw new Error('Failed to register show');
    }

    return response.json();
  } catch (err) {
    throw new Error('Failed to register show');
  }
}

const removeShow = async (showId: number): Promise<void> => {
  try {
    const response = await safeFetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to remove show');
    }
  } catch (err) {
    throw new Error('Failed to remove show');
  }
}

const updateShowStatus = async (showId: number, status: string): Promise<Show> => {
  try {
    const response = await safeFetch(`${NEXTWATCH_API.SHOWS}/${showId}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update show status');
    }

    return response.json();
  } catch (err) {
    throw new Error('Failed to update show status');
  }
}

const fetchWatcheds = async (showId: number) => {
  try {
    const response = await safeFetch(`${BASE_URL}/watched/${showId}`, {
      method: 'GET',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch watched episodes');
    }

    const data = await response.json() as WatchedEpisode[];

    return data;
  } catch (err) {
    return [] as WatchedEpisode[];
  }
}

const markEpisodeAsWatched = async (showId: number, episodeId: number) => {
  try {
    const response = await safeFetch(`${BASE_URL}/watched/${showId}/${episodeId}`, {
      method: 'POST',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to mark episode as watched');
    }

    const data = await response.json() as WatchedEpisode;

    return data;
  } catch (err) {
    throw new Error('Failed to mark episode as watched');
  }
}

const unmarkEpisodeAsWatched = async (showId: number, episodeId: number) => {
  try {
    const response = await safeFetch(`${BASE_URL}/watched/${showId}/${episodeId}`, {
      method: 'PATCH',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to unmark episode as watched');
    }
  } catch (err) {
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