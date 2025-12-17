export type Statuses = 'NOT_STARTED' | 'WATCHING' | 'COMPLETED';

export type Show = {
  id: number;
  tvMazeId: number;
  status: Statuses;
  createdAt: string;
  updatedAt: string | null;
};