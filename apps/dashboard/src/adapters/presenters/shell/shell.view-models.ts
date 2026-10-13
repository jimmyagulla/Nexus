export type ShellRole = 'employee' | 'employer';

export interface ShellNavItem {
  label: string;
  to: string;
  /** Remix Icon class, e.g. `ri-home-5-line`. */
  icon: string;
  /** Icon shown when the item is active (mobile tab bar). */
  activeIcon?: string;
  badge?: string;
  /** Only active on an exact match of the path. */
  exact?: boolean;
}

export interface ShellNavSection {
  title: string;
  items: ShellNavItem[];
}

export interface ShellUser {
  initials: string;
  name: string;
  /** "Dernière connexion 09:12" */
  lastLogin: string;
}

export interface SearchPreviewResult {
  title: string;
  subtitle: string;
}

export interface SearchPreview {
  /** Query shown once the search is focused, e.g. "bulletin mars". */
  query: string;
  interpretation: string[];
  groupLabel: string;
  results: SearchPreviewResult[];
  action: string;
}

export interface ShellViewModel {
  role: ShellRole;
  companyName: string;
  user: ShellUser;
  sections: ShellNavSection[];
  mobileTabs: ShellNavItem[];
  searchPlaceholder: string;
  searchPreview?: SearchPreview;
  hasUnreadNotifications: boolean;
  switchTo: { label: string; to: string };
}
