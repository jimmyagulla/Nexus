import { createFileRoute } from '@tanstack/react-router';
import { APP_ROUTES } from '@hexagonal-monorepo-template/ports';
import { companySettingsComposition } from '../../di';
import { SettingsPage } from '../views/SettingsPage';

type SettingsMatchesCatalog = typeof APP_ROUTES.settings extends '/parametres'
  ? true
  : never;
const settingsMatchesCatalog: SettingsMatchesCatalog = true;
void settingsMatchesCatalog;

export const Route = createFileRoute('/parametres')({
  component: () => <SettingsPage {...companySettingsComposition} />,
});
