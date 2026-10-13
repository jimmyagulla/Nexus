import { ReactNode } from 'react';
import { NavigationComposition } from '../../../composition/navigation.composition';
import { useNavigationEntries } from '../../hooks/useNavigationEntries';
import { Layout } from './Layout';

interface AppShellProps {
  deps: NavigationComposition;
  children: ReactNode;
}

export function AppShell({ deps, children }: AppShellProps) {
  const entries = useNavigationEntries(deps);

  return <Layout entries={entries}>{children}</Layout>;
}
