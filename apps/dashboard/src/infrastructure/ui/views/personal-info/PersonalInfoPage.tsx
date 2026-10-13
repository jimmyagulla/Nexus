import { personalInfoFixture } from '../../fixtures/personal-info.fixture';
import { PersonalInfo } from './PersonalInfo';

/** Placeholder data until the personal information presenter is wired. */
export function PersonalInfoPage() {
  return <PersonalInfo model={personalInfoFixture} />;
}
