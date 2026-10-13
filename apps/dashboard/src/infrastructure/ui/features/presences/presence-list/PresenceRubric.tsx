import { i18n } from '../../../i18n/i18n';

interface PresenceRubricProps {
  label: string;
  entries: string[];
}

export function PresenceRubric({ label, entries }: PresenceRubricProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      {entries.length === 0 ? (
        <p className="text-sm">{i18n.messages.presences.empty}</p>
      ) : (
        <ul className="text-sm">
          {entries.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
