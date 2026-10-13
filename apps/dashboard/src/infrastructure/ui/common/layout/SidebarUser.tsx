import { Link } from '@tanstack/react-router';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Avatar, AvatarFallback } from '../../shared/avatar';
import type { ShellUser } from '../../../../adapters/presenters/shell/shell.presenter';

interface SidebarUserProps {
  user: ShellUser;
}

export function SidebarUser({ user }: SidebarUserProps) {
  return (
    <div className="flex items-center gap-2.5 border-t border-border px-4 py-3">
      <Avatar>
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-13 font-bold leading-4 text-foreground">
          {user.name}
        </span>
        <span className="text-11 leading-3.5 text-muted-foreground">
          {user.lastLogin}
        </span>
      </div>
      <Link
        to={AppRoutes.login}
        aria-label={i18n.messages.shell.logout}
        className="text-primary focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className="ri-logout-box-r-line text-18" />
      </Link>
    </div>
  );
}
