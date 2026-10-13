import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface BrandLogoProps {
  /** `sidebar`: 24px mark, 18px name. `mobile`: 22px / 17px. `auth`: 32px / 24px. */
  size?: 'sidebar' | 'mobile' | 'auth';
  className?: string;
}

const markClassName = {
  sidebar: 'size-6',
  mobile: 'size-5.5',
  auth: 'size-8',
};

const nameClassName = {
  sidebar: 'text-18',
  mobile: 'text-17',
  auth: 'text-24',
};

export function BrandLogo({ size = 'sidebar', className }: BrandLogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img
        src="/icon-septeo-orange.svg"
        alt=""
        className={cn('block shrink-0', markClassName[size])}
      />
      <span
        className={cn(
          'font-display font-bold text-heading',
          size === 'sidebar' && 'tracking-logo',
          nameClassName[size],
          'leading-none',
        )}
      >
        {i18n.messages.shell.productName}
      </span>
    </span>
  );
}
