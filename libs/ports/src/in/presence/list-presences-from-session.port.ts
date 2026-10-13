import { PresenceListSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IListPresencesFromSession {
  execute(): Promise<PresenceListSnapshot>;
}

export const IListPresencesFromSession = Symbol('IListPresencesFromSession');
