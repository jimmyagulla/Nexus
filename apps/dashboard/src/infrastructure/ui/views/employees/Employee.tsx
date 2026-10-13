import { InfoNote } from '../../common/feedback/InfoNote';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { Card, CardHeader, CardTitle } from '../../shared/card';
import { ActionHistoryItem } from './components/ActionHistoryItem';
import { EmployeeHeader } from './components/EmployeeHeader';
import { IdentityRow } from './components/IdentityRow';
import { SpaceSummaryTile } from './components/SpaceSummaryTile';
import type { EmployeeViewModel } from '../../../../adapters/presenters/employees/employee.presenter';

/** P8.3 — employee space seen by the employer, overview tab. */
export function Employee({ model }: { model: EmployeeViewModel }) {
  const labels = i18n.messages.employees.overview;

  return (
    <>
      <EmployeeHeader employee={model.employee} />
      <PageContent className="gap-5 md:px-8 md:py-6">
        <div className="grid grid-cols-4 gap-4">
          {model.summary.map((tile) => (
            <SpaceSummaryTile key={tile.label} tile={tile} />
          ))}
        </div>
        <div className="grid grid-cols-2 items-start gap-5">
          <Card>
            <CardHeader>
              <CardTitle>{labels.identity}</CardTitle>
            </CardHeader>
            {model.identity.map((row) => (
              <IdentityRow key={row.label} row={row} />
            ))}
          </Card>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{labels.actionsHistory}</CardTitle>
              </CardHeader>
              {model.history.map((item) => (
                <ActionHistoryItem key={item.label} item={item} />
              ))}
            </Card>
            <InfoNote
              className="border border-border bg-card px-3.5 py-3"
              icon={
                <i
                  aria-hidden
                  className="ri-shield-keyhole-line text-18 text-green-500"
                />
              }
            >
              <span className="text-muted-foreground">{labels.accessLogNote}</span>
            </InfoNote>
          </div>
        </div>
      </PageContent>
    </>
  );
}
