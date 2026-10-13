import {
  PresenceListFilter,
  PresenceListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListPresencesFromSession {
  execute(filter?: PresenceListFilter): Promise<PresenceListSnapshot>;
}

export const IListPresencesFromSession = Symbol('IListPresencesFromSession');
