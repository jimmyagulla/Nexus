import { Link } from '@tanstack/react-router';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../shared/dropdown-menu';
import { IconTile } from '../data/IconTile';
import type { ShellRole } from './shell.types';

interface RoleCardProps {
  role: ShellRole;
  companyName: string;
  switchTo: { label: string; to: string };
}

/** "Vue salarié / Vue employeur" card; opens a menu to switch view. */
export function RoleCard({ role, companyName, switchTo }: RoleCardProps) {
  const employer = role === 'employer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'mx-3 mb-2 mt-3 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left focus-visible:outline-none focus-visible:shadow-focus',
          employer ? 'bg-heading' : 'bg-accent',
        )}
      >
        <IconTile tone={employer ? 'translucent' : 'primary'} size={32}>
          <i
            aria-hidden
            className={cn(employer ? 'ri-building-2-line' : 'ri-user-line', 'text-18')}
          />
        </IconTile>
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              'text-13 font-bold leading-4.5',
              employer ? 'text-white' : 'text-heading',
            )}
          >
            {employer
              ? i18n.messages.shell.employerView
              : i18n.messages.shell.employeeView}
          </span>
          <span
            className={cn(
              'text-12 leading-4',
              employer ? 'text-grey-300' : 'text-muted-foreground',
            )}
          >
            {companyName}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-54">
        <DropdownMenuItem asChild>
          <Link to={switchTo.to}>
            <i aria-hidden className="ri-arrow-left-right-line" />
            {switchTo.label}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
