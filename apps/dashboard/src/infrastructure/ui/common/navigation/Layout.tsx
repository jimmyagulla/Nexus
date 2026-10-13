import { ReactNode } from 'react';
import {
  Briefcase,
  FileDown,
  FileUp,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type {
  NavigationEntryId,
  NavigationEntryViewModel,
} from '../../../../adapters/presenters/navigation.presenter';
import { NavigationLink } from './NavigationLink';

const ICONS: Record<NavigationEntryId, LucideIcon> = {
  dashboard: LayoutDashboard,
  settings: Settings,
  cabinet: Briefcase,
  receivedDocuments: FileDown,
  depositDocument: FileUp,
};

interface LayoutProps {
  entries: NavigationEntryViewModel[];
  children: ReactNode;
}

export function Layout({ entries, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Nexus
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {entries.map((entry) => {
            const Icon = ICONS[entry.id];
            return (
              <NavigationLink
                key={entry.id}
                to={entry.to}
                icon={<Icon className="h-5 w-5" />}
                label={entry.label}
              />
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
