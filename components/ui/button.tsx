import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-primary-950 dark:focus-visible:ring-primary-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-white hover:bg-primary-500/80 border-2 border-primary-500 hover:border-primary-500/80',
        destructive:
          'bg-red-500 text-white hover:bg-red-500/80 border-2 border-red-500 hover:border-red-500/80',
        outline:
          'border-2 border-primary-500 hover:bg-primary-200 text-primary-500 dark:hover:bg-primary-950',
        ghost:
          'hover:bg-primary-200 text-primary-500 dark:hover:bg-primary-950',
        link: 'text-primary-500 underline-offset-4 hover:underline',
        input:
          'text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
