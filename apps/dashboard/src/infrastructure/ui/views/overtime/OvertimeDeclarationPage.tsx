import { overtimeDeclarationFixture } from '../../fixtures/overtime.fixture';
import { OvertimeDeclaration } from './OvertimeDeclaration';

/** Placeholder data until the overtime presenter is wired. */
export function OvertimeDeclarationPage() {
  return <OvertimeDeclaration model={overtimeDeclarationFixture} />;
}
