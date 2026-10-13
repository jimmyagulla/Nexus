import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { FlowTone } from '../../../../adapters/presenters/display.view-models';
import { cn } from '../../lib/utils';

const tones = {
  blue: 'bg-blue-100 text-blue-700',
  primary: 'bg-blue-700 text-white',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-800',
  orange: 'bg-orange-50 text-orange-700',
  dark: 'bg-grey-950 text-white',
  translucent: 'bg-white/14 text-white',
  neutral: 'bg-grey-100 text-grey-800',
} satisfies Record<FlowTone, string>;

/**
 * Tinted square (or round) holding an icon. The tone is the colour code of a
 * flow: blue = documents & payslips, green = leaves, purple = time,
 * amber = expense reports, orange = professional expenses, dark = accounting firm.
 * Size the icon itself through its own className.
 */
export const iconTileVariants = cva(
  'flex shrink-0 items-center justify-center',
  {
    variants: {
      tone: tones,
      size: {
        18: 'size-4.5 rounded-sm',
        28: 'size-7 rounded-md',
        30: 'size-7.5 rounded-lg',
        32: 'size-8 rounded-lg',
        36: 'size-9 rounded-lg',
        40: 'size-10 rounded-lg',
        44: 'size-11 rounded-lg',
        48: 'size-12 rounded-full',
        56: 'size-14 rounded-full',
      },
    },
    defaultVariants: { tone: 'blue', size: 36 },
  },
);

interface IconTileProps extends VariantProps<typeof iconTileVariants> {
  children: ReactNode;
  className?: string;
}

export function IconTile({ tone, size, className, children }: IconTileProps) {
  return (
    <span className={cn(iconTileVariants({ tone, size }), className)}>
      {children}
    </span>
  );
}
