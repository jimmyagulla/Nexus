import { Avatar, AvatarFallback } from '../../shared/avatar';
import { NotificationBell } from './NotificationBell';
import { SecureConnectionChip } from './SecureConnectionChip';
import { SmartSearch } from './SmartSearch';
import type { ShellModel } from './shell.types';

interface TopbarProps {
  model: ShellModel;
}

/** 56px top bar: smart search, secure connection chip, notifications, avatar. */
export function Topbar({ model }: TopbarProps) {
  return (
    <header className="relative z-5 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-8">
      <SmartSearch
        placeholder={model.searchPlaceholder}
        preview={model.searchPreview}
      />
      <div className="ml-auto" />
      <SecureConnectionChip />
      <NotificationBell unread={model.hasUnreadNotifications} />
      <span className="h-6 w-px shrink-0 bg-border" />
      <Avatar>
        <AvatarFallback>{model.user.initials}</AvatarFallback>
      </Avatar>
    </header>
  );
}
