import { createFileRoute } from '@tanstack/react-router';
import { APP_ROUTES } from '@hexagonal-monorepo-template/ports';
import { HomePage } from '../views/HomePage';

type HomeMatchesCatalog = typeof APP_ROUTES.home extends '/' ? true : never;
const homeMatchesCatalog: HomeMatchesCatalog = true;
void homeMatchesCatalog;

export const Route = createFileRoute('/')({
  component: HomePage,
});
