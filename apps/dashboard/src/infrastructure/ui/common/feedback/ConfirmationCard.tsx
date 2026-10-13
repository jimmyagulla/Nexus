import { ReactNode } from 'react';
import { IconTile } from '../data/IconTile';

interface ConfirmationCardProps {
  title: string;
  description: string;
  /** Recap, progress, … stacked under the heading. */
  children?: ReactNode;
  /** Buttons row; each button usually takes `flex-1`. */
  actions: ReactNode;
}

/** Centered 560px success card of the "transmitted / sent" screens. */
export function ConfirmationCard({
  title,
  description,
  children,
  actions,
}: ConfirmationCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <section className="flex w-140 max-w-full flex-col gap-5 rounded-lg border border-border bg-card p-8">
        <IconTile tone="green" size={56}>
          <i aria-hidden className="ri-check-line text-30" />
        </IconTile>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-24 font-bold leading-8 text-heading">{title}</h1>
          <p className="text-pretty text-14 leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
        <div className="flex gap-3">{actions}</div>
      </section>
    </div>
  );
}
