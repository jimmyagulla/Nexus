import { ActorContext } from '@hexagonal-monorepo-template/domain';

export type AuthenticatedRequest = {
  headers: { authorization?: string };
  url?: string;
  params?: { companyId?: string };
  actor?: ActorContext;
};
