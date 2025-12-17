import { Statuses } from '@/lib/constants';

export type Show = {
  id: number;
  showId: number;
  status: Statuses;
  createdAt: string;
  updatedAt: string | null;
};