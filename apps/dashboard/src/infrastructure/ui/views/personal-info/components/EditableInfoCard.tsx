import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../../shared/card';
import { EditableInfoRow } from './EditableInfoRow';
import type { EditableInfoModel } from '../../../../../adapters/presenters/personal-info/editable-info.presenter';

interface EditableInfoCardProps {
  fields: EditableInfoModel[];
  /** "Modifier": opens the edition modal. */
  onEdit: () => void;
  /** Shows the "Coordonnées personnelles" subtitle. */
  withDescription?: boolean;
  className?: string;
}

/** "Informations modifiables par vous" card. */
export function EditableInfoCard({
  fields,
  onEdit,
  withDescription,
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
          size="sm"
          className="px-3.5 shadow-focus"
          onClick={onEdit}
        >
          <i aria-hidden className="ri-edit-line" />
          {labels.edit}
        </Button>
      </CardHeader>
      {fields.map((field) => (
        <EditableInfoRow
          key={field.id}
          model={field}
        />
      ))}
    </Card>
  );
}
