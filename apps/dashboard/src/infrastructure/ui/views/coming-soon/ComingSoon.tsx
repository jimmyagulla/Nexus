import { Link } from '@tanstack/react-router';
import { IconTile } from '../../common/data/IconTile';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';

interface ComingSoonProps {
  title: string;
  backTo: string;
}

/** Destination of a navigation entry whose screen is not designed yet. */
export function ComingSoon({ title, backTo }: ComingSoonProps) {
  const labels = i18n.messages.common;

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <section className="flex w-140 max-w-full flex-col items-start gap-5 rounded-lg border border-border bg-card p-8">
        <IconTile tone="blue" size={48}>
          <i aria-hidden className="ri-tools-line text-24" />
        </IconTile>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-24 font-bold leading-8 text-heading">{title}</h1>
          <p className="text-14 leading-5 text-muted-foreground">
            {labels.comingSoonDescription}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={backTo}>{labels.backToDashboard}</Link>
        </Button>
      </section>
    </div>
  );
}
