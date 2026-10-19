import type { EmployerInfoModel } from '../../../../../adapters/presenters/personal-info/employer-info.presenter';

interface EmployerInfoRowProps {
  model: EmployerInfoModel;
}

/** Read-only label / value line of the employer-managed card. */
export function EmployerInfoRow({ model }: EmployerInfoRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-border px-5 py-2.75 text-14">
      <span className="text-muted-foreground">
        <span>{model.label}</span>
      </span>
      <span className="text-right font-semibold text-foreground">
        <span>{model.value}</span>
      </span>
    </div>
  );
}
