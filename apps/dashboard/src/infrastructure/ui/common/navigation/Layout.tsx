import { ReactNode } from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';
import { AppRoutes } from '@hexagonal-monorepo-template/ports';
import { i18n } from '../../i18n/i18n';
import { NavigationLink } from './NavigationLink';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Nexus
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavigationLink
            to={AppRoutes.home}
            icon={<LayoutDashboard className="h-5 w-5" />}
            label={i18n.messages.navigation.dashboard}
          />
          <NavigationLink
            to={AppRoutes.settings}
            icon={<Settings className="h-5 w-5" />}
            label={i18n.messages.navigation.settings}
          />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
