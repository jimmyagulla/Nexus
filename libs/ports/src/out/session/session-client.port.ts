export type SessionRecord = {
  accessToken: string;
  userId: string;
  appMetadata: Readonly<Record<string, unknown>>;
};

export interface ISessionClient {
  getSession(): Promise<SessionRecord | null>;
  refreshSession(): Promise<void>;
}

export const ISessionClient = Symbol('ISessionClient');
