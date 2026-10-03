import { ReactNode } from 'react';
import { APP_ROUTES } from '@hexagonal-monorepo-template/ports';
import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Dashboard
          </h1>
        </div>
        <nav className="flex-1 px-4">
          <Link
            to={APP_ROUTES.home}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
              'text-muted-foreground hover:bg-accent hover:text-primary',
              '[&.active]:bg-accent [&.active]:text-primary [&.active]:font-semibold',
            )}
          >
            <LayoutDashboard className="mr-4 h-5 w-5" />
            Tableau de bord
          </Link>
          <Link
            to={APP_ROUTES.settings}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
              'text-muted-foreground hover:bg-accent hover:text-primary',
              '[&.active]:bg-accent [&.active]:text-primary [&.active]:font-semibold',
            )}
          >
            <Settings className="mr-4 h-5 w-5" />
            Paramètres
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
