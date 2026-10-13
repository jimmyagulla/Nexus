import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { useConfirmSecondFactorEnrollment } from '../hooks/useConfirmSecondFactorEnrollment';
import { useGetSecondFactorEnrollment } from '../hooks/useGetSecondFactorEnrollment';
import { i18n } from '../i18n/i18n';
import { SecondFactorEnrollment } from './SecondFactorEnrollment';

interface SecondFactorEnrollmentPageProps {
  deps: SecondFactorComposition;
}

export function SecondFactorEnrollmentPage({
  deps,
}: SecondFactorEnrollmentPageProps) {
  const enrollment = useGetSecondFactorEnrollment(deps);
  const confirm = useConfirmSecondFactorEnrollment(deps);

  if (enrollment.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (enrollment.isError) {
    return <p>{deps.errorPresenter.present(enrollment.error)}</p>;
  }

  return (
    <SecondFactorEnrollment
      model={enrollment.data}
      errorPresenter={deps.errorPresenter}
      confirmed={confirm.isSuccess}
      submissionError={
        confirm.isError ? deps.errorPresenter.present(confirm.error) : null
      }
      pending={confirm.isPending}
      onConfirm={async (code) => {
        await confirm.mutateAsync(code).catch(() => undefined);
      }}
    />
  );
}
