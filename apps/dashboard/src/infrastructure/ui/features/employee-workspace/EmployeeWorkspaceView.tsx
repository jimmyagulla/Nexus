import type { EmployeeWorkspaceViewModel } from '../../../../adapters/presenters/employee-workspace.presenter';
import { i18n } from '../../i18n/i18n';

interface EmployeeWorkspaceViewProps {
  model: EmployeeWorkspaceViewModel;
}

export function EmployeeWorkspaceView({ model }: EmployeeWorkspaceViewProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">
        {i18n.messages.workspace.title}
      </h1>
      <p>{i18n.messages.activation.opened}</p>
      <p className="font-medium">{model.fullName}</p>
      <p className="text-muted-foreground">
        {i18n.messages.workspace.noDocuments}
      </p>
    </section>
  );
}
