import { personalInfoEditFixture } from '../../fixtures/personal-info.fixture';
import { PersonalInfoEdit } from './PersonalInfoEdit';

/** Placeholder data until the personal information presenter is wired. */
export function PersonalInfoEditPage() {
  return <PersonalInfoEdit model={personalInfoEditFixture} />;
}
