export interface TVMazeCountry {
  name: string;
  code: string;
  timezone: string;
}

export interface TVMazeSchedule {
  time: string;
  days: string[];
}

export interface TVMazeRating {
  average: number | null;
}

export interface TVMazeExternals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

export interface TVMazeImage {
  medium: string;
  original: string;
}

export interface TVMazeLink {
  href: string;
}

export interface TVMazeNamedLink extends TVMazeLink {
  name?: string;
}

export interface TVMazeNetwork {
  id: number;
  name: string;
  country: TVMazeCountry | null;
  officialSite?: string | null;
}

export interface TVMazeWebChannel {
  id: number;
  name: string;
  country: TVMazeCountry | null;
  officialSite?: string | null;
}

export interface TVMazeLinks {
  self: TVMazeLink;
  previousepisode?: TVMazeNamedLink;
  nextepisode?: TVMazeNamedLink;
}

export interface TVMazeShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: TVMazeSchedule;
  rating: TVMazeRating;
  weight: number;
  network: TVMazeNetwork | null;
  webChannel: TVMazeWebChannel | null;
  dvdCountry: TVMazeCountry | null;
  externals: TVMazeExternals;
  image: TVMazeImage | null;
  summary: string | null;
  updated: number;
  _links: TVMazeLinks;
}

export interface TVMazeSearchResult {
  score: number;
  show: TVMazeShow;
}

export interface TVMazeEpisodeLinks {
  self: TVMazeLink;
  show: TVMazeNamedLink;
}

export interface TVMazeEpisode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate: string | null;
  airtime: string | null;
  airstamp: string | null;
  runtime: number | null;
  rating: TVMazeRating;
  image: TVMazeImage | null;
  summary: string | null;
  _links: TVMazeEpisodeLinks;
}

export interface TVMazeEpisodeExtended extends TVMazeEpisode {
  watchedAt: string | null;
}