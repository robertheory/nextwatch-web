'use client';

import { searchShows } from '@/lib/tvmaze-api';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover';

type Result = {
  score: number;
  show: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
    premiered?: string | null;
  };
};

const MIN_QUERY = 2;

const Searchbar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper to perform search immediately (no debounce). Only applies results
  // if the current input value matches the query used to fetch (prevents race).
  const doSearch = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < MIN_QUERY) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await searchShows(trimmed);
      // ensure input hasn't changed since we started the request
      if (inputRef.current?.value.trim() !== trimmed) return;
      setResults(res);
      setOpen(res.length > 0);
    } catch (err) {
      console.error('Search error:', err);
      if (inputRef.current?.value.trim() === trimmed) {
        setResults([]);
        setOpen(false);
      }
    } finally {
      if (inputRef.current?.value.trim() === trimmed) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch(inputRef.current?.value ?? '');
    }
  };

  const handleClickSearch = () => {
    doSearch(inputRef.current?.value ?? '');
  };

  // Close popover when input is cleared programmatically or when results empty.
  useEffect(() => {
    if (!inputRef.current) return;
    if ((inputRef.current.value?.trim() ?? '').length < MIN_QUERY) {
      setOpen(false);
      setResults([]);
    }
  }, []);

  const currentQueryLength = () =>
    (inputRef.current?.value ?? '').trim().length;

  return (
    <div className='relative flex items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverAnchor>
          <div className='flex items-center gap-2'>
            <Input
              ref={inputRef}
              type='text'
              placeholder='Search for shows...'
              className='w-full max-w-md'
              aria-label='Search shows'
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleClickSearch} size='sm'>
              Search
            </Button>
          </div>
        </PopoverAnchor>

        <PopoverContent
          align='start'
          sideOffset={8}
          className='max-h-80 w-md overflow-auto p-2'
        >
          {loading && (
            <div className='px-2 py-2 text-sm text-muted-foreground'>
              Loading...
            </div>
          )}

          {!loading &&
            results.length === 0 &&
            currentQueryLength() >= MIN_QUERY && (
              <div className='px-2 py-2 text-sm text-muted-foreground'>
                No results
              </div>
            )}

          {!loading &&
            results.map((r) => (
              <button
                key={r.show.id}
                className='flex w-full gap-2 items-center px-2 py-1.5 text-left hover:bg-accent/5 rounded'
                onClick={() => {
                  if (r.show.id) {
                    window.open(
                      `https://www.tvmaze.com/shows/${r.show.id}`,
                      '_blank'
                    );
                  }
                  setOpen(false);
                }}
                type='button'
              >
                <div className='relative h-10 w-16 shrink-0 overflow-hidden rounded-sm bg-muted'>
                  {r.show.image ? (
                    <Image
                      src={r.show.image.medium}
                      alt={r.show.name}
                      width={80}
                      height={60}
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
                      No image
                    </div>
                  )}
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>{r.show.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {r.show.premiered
                      ? new Date(r.show.premiered).getFullYear()
                      : '–'}
                  </span>
                </div>
              </button>
            ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Searchbar;
