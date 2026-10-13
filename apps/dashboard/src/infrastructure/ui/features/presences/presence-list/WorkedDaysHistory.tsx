import { i18n } from '../../../i18n/i18n';

interface WorkedDaysHistoryProps {
  originalWorkedDays: number;
  history: string[];
}

export function WorkedDaysHistory({
  originalWorkedDays,
  history,
}: WorkedDaysHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="text-sm">
      <h3 className="font-medium text-muted-foreground">
        {i18n.messages.presences.history}
      </h3>
      <p>{`${i18n.messages.presences.originalValue} : ${originalWorkedDays}`}</p>
      <ul>
        {history.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
