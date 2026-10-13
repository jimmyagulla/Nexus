import { cn } from '../../lib/utils';
import { BrandLogo } from './BrandLogo';
import { RoleCard } from './RoleCard';
import { SidebarNavSection } from './SidebarNavSection';
import { SidebarUser } from './SidebarUser';
import type { ShellViewModel } from '../../../../adapters/presenters/shell/shell.view-models';

interface SidebarProps {
  model: ShellViewModel;
  className?: string;
}

/** 240px navigation column of the v3 design, for both roles. */
export function Sidebar({ model, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-card',
        className,
      )}
    >
      <div className="box-content flex h-14 shrink-0 items-center border-b border-border px-5">
        <BrandLogo />
      </div>
      <RoleCard
        role={model.role}
        companyName={model.companyName}
        switchTo={model.switchTo}
      />
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3 pt-1">
        {model.sections.map((section) => (
          <SidebarNavSection key={section.title} section={section} />
        ))}
      </nav>
      <SidebarUser user={model.user} />
    </aside>
  );
}
