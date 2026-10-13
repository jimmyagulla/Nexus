import { IconTile } from '../../../common/data/IconTile';
import { i18n } from '../../../i18n/i18n';
import { Badge } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { Card } from '../../../shared/card';
import type { FirmConnectionModel } from '../../../../../adapters/presenters/accounting-firm/accounting-firm.view-models';

/** Linked accounting firm: name, connection state, contact, access actions. */
export function FirmConnectionCard({ firm }: { firm: FirmConnectionModel }) {
  const labels = i18n.messages.accountingFirm.exchanges;

  return (
    <Card className="flex items-center gap-4 px-4.5 py-3.5">
      <IconTile tone="dark" size={44}>
        <i aria-hidden className="ri-building-4-line text-22" />
      </IconTile>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2.5">
          <span className="text-16 font-bold text-heading">{firm.name}</span>
          <Badge tone="success" className="gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500" />
            {labels.activeConnection}
          </Badge>
        </span>
        <span className="text-13 text-muted-foreground">{firm.contact}</span>
      </div>
      <Button variant="outline" size="sm" className="gap-1.5 text-13">
        <i aria-hidden className="ri-user-add-line" />
        {labels.inviteCollaborator}
      </Button>
      <Button variant="ghost" size="sm" className="gap-1.5 text-13">
        <i aria-hidden className="ri-settings-3-line" />
        {labels.manageAccess}
      </Button>
    </Card>
  );
}
