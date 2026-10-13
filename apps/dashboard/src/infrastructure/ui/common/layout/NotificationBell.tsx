import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface NotificationBellProps {
  unread: boolean;
  className?: string;
}

export function NotificationBell({ unread, className }: NotificationBellProps) {
  return (
    <button
      type="button"
      aria-label={i18n.messages.shell.notifications}
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center text-primary focus-visible:outline-none focus-visible:shadow-focus',
        className,
      )}
    >
      <i aria-hidden className="ri-notification-3-line text-20" />
      {unread && (
        <span className="absolute right-1.25 top-1.25 size-2 rounded-full border-2 border-white bg-brand" />
      )}
    </button>
  );
}
