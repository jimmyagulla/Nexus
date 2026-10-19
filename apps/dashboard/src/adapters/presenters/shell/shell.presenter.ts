export type ShellRole = 'employee' | 'employer';

/** Live counts a navigation item can show as its badge. */
export type ShellCounter = 'unseenPayslips';

export type ShellCounters = Readonly<Partial<Record<ShellCounter, number>>>;

export interface ShellNavItem {
  label: string;
  to: string;
  /** Remix Icon class, e.g. `ri-home-5-line`. */
  icon: string;
  /** Icon shown when the item is active (mobile tab bar). */
  activeIcon?: string;
  badge?: string;
  /** Count shown as the badge, replacing any fixed one; hidden at zero. */
  counter?: ShellCounter;
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

/**
 * Presents the app shell (navigation, user, search) of one role.
 * Until the session use case exists, it receives placeholder data already
 * shaped as the view model, and fills in the badges of the live counters.
 */
export class ShellPresenter {
  present(shell: ShellViewModel, counters: ShellCounters = {}): ShellViewModel {
    return {
      ...shell,
      sections: shell.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => this.presentItem(item, counters)),
      })),
    };
  }

  private presentItem(item: ShellNavItem, counters: ShellCounters): ShellNavItem {
    if (item.counter === undefined) {
      return item;
    }
    const count = counters[item.counter] ?? 0;
    return { ...item, badge: count > 0 ? String(count) : undefined };
  }
}
