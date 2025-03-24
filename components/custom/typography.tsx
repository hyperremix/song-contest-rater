import { cn } from '@/lib/utils';
import { JSX } from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
  p: 'text-base',
  span: 'text-sm',
};

export const Typography = ({ children, className, variant = 'p' }: Props) => {
  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
};
