import { Link } from '@tanstack/react-router';
import { cn } from '../../lib/utils';
import type { ShellNavItem } from '../../../../adapters/presenters/shell/shell.presenter';

interface MobileTabBarItemProps {
  item: ShellNavItem;
}

export function MobileTabBarItem({ item }: MobileTabBarItemProps) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.exact ?? false }}
      className="group flex flex-col items-center justify-center gap-0.5 text-subtle data-[status=active]:text-primary"
    >
      <i aria-hidden className={cn(item.icon, 'text-22 group-data-[status=active]:hidden')} />
      <i
        aria-hidden
        className={cn(item.activeIcon ?? item.icon, 'hidden text-22 group-data-[status=active]:block')}
      />
      {item.label}
    </Link>
  );
}
