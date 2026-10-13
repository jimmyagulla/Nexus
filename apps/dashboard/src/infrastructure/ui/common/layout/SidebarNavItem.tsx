import { Link } from '@tanstack/react-router';
import { cn } from '../../lib/utils';
import type { ShellNavItem } from './shell.types';

interface SidebarNavItemProps {
  item: ShellNavItem;
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.exact ?? false }}
      className="group flex items-center gap-2.5 rounded-lg px-3 py-1.75 text-13 font-semibold leading-5 text-body transition-colors hover:bg-grey-50 data-[status=active]:bg-accent data-[status=active]:text-primary"
    >
      <i aria-hidden className={cn(item.icon, 'shrink-0 text-20')} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="shrink-0 rounded-full bg-grey-200 px-1.75 py-px text-11 font-bold leading-3.5 text-body group-data-[status=active]:bg-primary group-data-[status=active]:text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
