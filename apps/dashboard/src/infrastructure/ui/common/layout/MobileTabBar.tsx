import { MobileTabBarItem } from './MobileTabBarItem';
import type { ShellNavItem } from '../../../../adapters/presenters/shell/shell.view-models';

interface MobileTabBarProps {
  items: ShellNavItem[];
}

/** 72px bottom navigation of the mobile layout. */
export function MobileTabBar({ items }: MobileTabBarProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="grid h-18 shrink-0 grid-cols-4 border-t border-border bg-card pb-3 text-11 font-semibold md:hidden">
      {items.map((item) => (
        <MobileTabBarItem key={item.to} item={item} />
      ))}
    </nav>
  );
}
