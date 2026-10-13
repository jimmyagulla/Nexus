import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { cn } from '../../../lib/utils';
import { AppRoutes } from '../../../routes/app-routes';
import { Button } from '../../../shared/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../../shared/card';
import { EditableInfoRow } from './EditableInfoRow';
import type { EditableInfoModel } from '../../../../../adapters/presenters/personal-info/personal-info.presenter';

interface EditableInfoCardProps {
  fields: EditableInfoModel[];
  /** Shows the "Coordonnées personnelles" subtitle. */
  withDescription?: boolean;
  /** `primary`: filled, highlighted "Modifier" (P3.1); `outline` after an update. */
  editVariant?: 'primary' | 'outline';
  /** Drops the bottom border of the last row. */
  closed?: boolean;
  className?: string;
}

/** "Informations modifiables par vous" card. */
export function EditableInfoCard({
  fields,
  withDescription,
  editVariant = 'primary',
  closed,
  className,
}: EditableInfoCardProps) {
  const labels = i18n.messages.personalInfo.view;

  return (
    <Card className={className}>
      <CardHeader className="py-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle>{labels.editableTitle}</CardTitle>
          {withDescription && (
            <CardDescription>{labels.editableDescription}</CardDescription>
          )}
        </div>
        <Button
          asChild
          size="sm"
          variant={editVariant === 'primary' ? 'default' : 'outline'}
          className={cn('px-3.5', editVariant === 'primary' && 'shadow-focus')}
        >
          <Link to={AppRoutes.personalInfoEdit}>
            <i aria-hidden className="ri-edit-line" />
            {labels.edit}
          </Link>
        </Button>
      </CardHeader>
      {fields.map((field) => (
        <EditableInfoRow
          key={field.id}
          model={field}
          className={closed ? 'last:border-b-0' : undefined}
        />
      ))}
    </Card>
  );
}
