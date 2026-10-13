import { PresenceComposition } from '../../composition/presence.composition';
import { useAdjustPresenceWorkedDays } from '../hooks/useAdjustPresenceWorkedDays';
import { useGetPresences } from '../hooks/useGetPresences';
import { useOpenPresence } from '../hooks/useOpenPresence';
import { i18n } from '../i18n/i18n';
import { Presences } from './Presences';

interface PresencesPageProps {
  deps: PresenceComposition;
}

export function PresencesPage({ deps }: PresencesPageProps) {
  const presences = useGetPresences(deps);
  const open = useOpenPresence(deps);
  const adjust = useAdjustPresenceWorkedDays(deps);

  if (presences.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (presences.isError) {
    return <p>{deps.errorPresenter.present(presences.error)}</p>;
  }

  return (
    <Presences
      model={presences.data}
      errorPresenter={deps.errorPresenter}
      openError={open.isError ? deps.errorPresenter.present(open.error) : null}
      adjustError={
        adjust.isError ? deps.errorPresenter.present(adjust.error) : null
      }
      onOpen={(values) =>
        open.mutateAsync(values).then(
          () => true,
          () => false,
        )
      }
      onAdjust={(presenceId, values) =>
        adjust.mutateAsync({ presenceId, workedDays: values.workedDays }).then(
          () => true,
          () => false,
        )
      }
    />
  );
}
