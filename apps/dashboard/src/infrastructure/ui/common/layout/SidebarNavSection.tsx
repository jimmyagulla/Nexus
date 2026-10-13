import type { ShellNavSection } from '../../../../adapters/presenters/shell/shell.presenter';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavSectionProps {
  section: ShellNavSection;
}

export function SidebarNavSection({ section }: SidebarNavSectionProps) {
  return (
    <>
      <div className="px-3 pb-0.75 pt-2.5 text-11 font-bold leading-3.5 text-subtle">
        {section.title}
      </div>
      {section.items.map((item) => (
        <SidebarNavItem key={item.to} item={item} />
      ))}
    </>
  );
}
