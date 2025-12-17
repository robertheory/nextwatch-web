import Link from 'next/link';
import Searchbar from './Searchbar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <div className='mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6'>
          <Link href='/' className='text-lg font-semibold text-foreground'>
            NextWatch
          </Link>

          <Searchbar />

          <nav className='ml-auto flex items-center gap-4'>
            <Link
              href='/my-shows'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              My Shows
            </Link>
          </nav>
        </div>
      </header>

      <main className='grow'>{children}</main>

      <footer className='border-t bg-background/95 p-4 text-center text-sm text-muted-foreground backdrop-blur supports-backdrop-filter:bg-background/60'>
        &copy; {new Date().getFullYear()} NextWatch. All rights reserved.
      </footer>
    </div>
  );
};

export default AppLayout;
