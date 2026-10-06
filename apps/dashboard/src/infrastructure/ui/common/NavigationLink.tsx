import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '../lib/utils';

interface NavigationLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export function NavigationLink({ to, icon, label }: NavigationLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
        'text-muted-foreground hover:bg-accent hover:text-primary',
        '[&.active]:bg-accent [&.active]:text-primary [&.active]:font-semibold',
      )}
    >
      <span className="mr-4 flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      {label}
    </Link>
  );
}
