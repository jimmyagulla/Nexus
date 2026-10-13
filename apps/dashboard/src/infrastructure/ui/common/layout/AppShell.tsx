import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { MobileTabBar } from './MobileTabBar';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { ShellViewModel } from '../../../../adapters/presenters/shell/shell.presenter';

interface AppShellProps {
  model: ShellViewModel;
  children: ReactNode;
}

/**
 * Sidebar + top bar on desktop, header + tab bar on mobile.
 * The main area scrolls; screens fill it with a PageContent.
 */
export function AppShell({ model, children }: AppShellProps) {
  return (
    <div className="flex h-dvh bg-background font-sans text-foreground">
      <Sidebar model={model} className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="hidden md:block">
          <Topbar model={model} />
        </div>
        <MobileHeader model={model} />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
        <MobileTabBar items={model.mobileTabs} />
      </div>
    </div>
  );
}
