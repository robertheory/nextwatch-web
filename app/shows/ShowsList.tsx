'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShowStatus, Statuses } from '@/lib/constants';
import { combineShowData } from '@/lib/formatting';
import { useState } from 'react';
import { ExtendedShow } from './page';

type ShowsListProps = {
  data: ExtendedShow[];
  status?: Statuses;
};

const ShowsList = ({ data, status }: ShowsListProps) => {
  const [statusFilter, setStatusFilter] = useState<Statuses | 'ALL'>(
    status ?? 'ALL'
  );
  const [shows, setShows] = useState<ExtendedShow[]>(data);

  const handleUpdateStatusFilter = async (value: string) => {
    const newStatus = value as Statuses | 'ALL';

    if (status !== newStatus) {
      const newShowsData = await combineShowData();
      setShows(newShowsData);
    }

    setStatusFilter(newStatus);
  };

  const statusesLabels = Object.keys(ShowStatus)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      key,
      label: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' '),
    }));

  const filteredShows = shows.filter((show) => {
    if (statusFilter === 'ALL') return true;
    return show.status === statusFilter;
  });

  return (
    <div className='w-full flex flex-col justify-start items-start gap-4'>
      <Select onValueChange={handleUpdateStatusFilter} value={statusFilter}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Filter by Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter by Status</SelectLabel>
            <SelectItem value='ALL'>All</SelectItem>
            {statusesLabels.map(({ key, label }) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {filteredShows.length === 0 ? (
        <div className='text-center text-sm text-muted-foreground'>
          No shows found for the selected status.
        </div>
      ) : (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredShows.map((show) => (
            <Card key={show.id} className='overflow-hidden'>
              <CardHeader>
                <div className='flex gap-4 items-start'>
                  <div className='w-24 h-32 shrink-0 overflow-hidden rounded-md bg-muted'>
                    {show.image ? (
                      <img
                        src={show.image.medium}
                        alt={show.name}
                        width={160}
                        height={220}
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
                        No image
                      </div>
                    )}
                  </div>

                  <div className='flex-1'>
                    <CardTitle className='text-base'>{show.name}</CardTitle>
                    <CardDescription className='text-sm'>
                      {show.genres?.length ? show.genres.join(', ') : '—'}
                    </CardDescription>
                    <div className='mt-2 text-xs text-muted-foreground'>
                      {show.premiered
                        ? new Date(show.premiered).getFullYear()
                        : '—'}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div
                  suppressHydrationWarning
                  className='text-sm text-muted-foreground line-clamp-3'
                  dangerouslySetInnerHTML={{ __html: show.summary ?? '' }}
                />
              </CardContent>

              <CardFooter>
                <div className='w-full flex items-center gap-2'>
                  <Link href={`/shows/${show.id}`}>
                    <Button size='sm'>Details</Button>
                  </Link>

                  <div className='ml-auto text-xs text-muted-foreground'>
                    Status: {show.status ?? '—'}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowsList;
