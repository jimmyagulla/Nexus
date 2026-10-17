import type { OvertimeDeclarationPageComposition } from '../../../composition/overtime/overtime-declaration-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetOvertimeDeclaration } from '../../hooks/overtime/useGetOvertimeDeclaration';
import { i18n } from '../../i18n/i18n';
import { OvertimeDeclaration } from './OvertimeDeclaration';

interface OvertimeDeclarationPageProps {
  deps: OvertimeDeclarationPageComposition;
}

export function OvertimeDeclarationPage({ deps }: OvertimeDeclarationPageProps) {
  const overtimeDeclaration = useGetOvertimeDeclaration(deps);

  if (overtimeDeclaration.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (overtimeDeclaration.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <OvertimeDeclaration model={overtimeDeclaration.data} />;
}
