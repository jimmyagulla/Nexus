import { i18n } from '../../i18n/i18n';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../shared/sheet';
import { BrandLogo } from './BrandLogo';
import { NotificationBell } from './NotificationBell';
import { Sidebar } from './Sidebar';
import type { ShellViewModel } from '../../../../adapters/presenters/shell/shell.view-models';

interface MobileHeaderProps {
  model: ShellViewModel;
}

/** 52px header of the mobile layout; the menu opens the full sidebar. */
export function MobileHeader({ model }: MobileHeaderProps) {
  return (
    <header className="box-content flex h-13 shrink-0 items-center gap-2.5 border-b border-border bg-card px-5 md:hidden">
      <Sheet>
        <SheetTrigger
          aria-label={i18n.messages.shell.openMenu}
          className="-ml-1 text-primary"
        >
          <i aria-hidden className="ri-menu-line text-22" />
        </SheetTrigger>
        <SheetContent side="right" withOverlay className="left-0 right-auto w-60 p-0">
          <SheetTitle className="sr-only">{i18n.messages.shell.openMenu}</SheetTitle>
          <Sidebar model={model} className="border-r-0" />
        </SheetContent>
      </Sheet>
      <BrandLogo size="mobile" className="flex-1" />
      <NotificationBell unread={model.hasUnreadNotifications} className="size-auto [&_i]:text-22" />
    </header>
  );
}
