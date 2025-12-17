import { TVMazeSearchResult, TVMazeShow } from '../types/tvmaze';

const BASE_URL = process.env.TVMAZE_API_URL || 'https://api.tvmaze.com';

export const TVMAZE_API = {
  BASE_URL,
  SHOWS: `${BASE_URL}/shows`,
  SEARCH: `${BASE_URL}/search/shows`,
};

export const searchShows = async (query: string): Promise<TVMazeSearchResult[]> => {
  const url = new URL(TVMAZE_API.SEARCH);

  url.searchParams.append('q', query);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to search shows');
  }
  const data = (await response.json()) as TVMazeSearchResult[];

  return data;
};

export const fetchShowByTvMazeId = async (tvMazeId: number): Promise<TVMazeShow> => {
  const response = await fetch(`${TVMAZE_API.SHOWS}/${tvMazeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch show from TVMaze');
  }

  const data = (await response.json()) as TVMazeShow;

  return data;
};

export const tvMazeApi = {
  searchShows,
  fetchShowByTvMazeId,
};