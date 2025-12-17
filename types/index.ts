export type Statuses = 'NOT_STARTED' | 'WATCHING' | 'COMPLETED';

export type Show = {
  id: number;
  showId: number;
  status: Statuses;
  createdAt: string;
  updatedAt: string | null;
};