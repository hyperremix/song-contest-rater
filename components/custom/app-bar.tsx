'use client';

import { useRouter } from '@/i18n/routing';
import { UserButton } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

type Props = {
  withBackButton?: boolean;
  children?: React.ReactNode;
};

export const AppBar = ({ children, withBackButton }: Props) => {
  const router = useRouter();
  const appBarRef = useRef<HTMLDivElement>(null);
  const [appBarHeight, setAppBarHeight] = useState(64);

  useEffect(() => {
    const updateHeight = () => {
      if (appBarRef.current) {
        const height = appBarRef.current.offsetHeight;
        setAppBarHeight(height);
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <>
      <div
        ref={appBarRef}
        className="fixed left-0 right-0 top-0 z-50 flex items-stretch justify-between bg-white px-3 py-2 dark:bg-zinc-900"
      >
        {withBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full [&_svg]:size-8"
          >
            <ArrowLeft />
          </Button>
        ) : (
          <div className="size-12">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'size-12',
                  userButtonPopoverActionButton: 'text-primary-500',
                },
              }}
            />
          </div>
        )}
        <div className="flex items-center">{children}</div>
        <div className="size-12 opacity-0" />
      </div>
      <div style={{ height: `${appBarHeight}px` }} />
    </>
  );
};
