import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { PresenceCard } from './PresenceCard';

interface PresenceListProps {
  presences: PresenceRowViewModel[];
}

export function PresenceList({ presences }: PresenceListProps) {
  return (
    <ul>
      {presences.map((presence) => (
        <PresenceCard key={presence.id} presence={presence} />
      ))}
    </ul>
  );
}
