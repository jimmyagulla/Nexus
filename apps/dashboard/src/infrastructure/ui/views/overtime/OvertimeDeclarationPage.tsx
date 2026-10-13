import type { OvertimeComposition } from '../../../composition/overtime.composition';
import { OvertimeDeclaration } from './OvertimeDeclaration';

interface OvertimeDeclarationPageProps {
  deps: OvertimeComposition;
}

export function OvertimeDeclarationPage({ deps }: OvertimeDeclarationPageProps) {
  return <OvertimeDeclaration model={deps.overtimeDeclarationPresenter.present()} />;
}
