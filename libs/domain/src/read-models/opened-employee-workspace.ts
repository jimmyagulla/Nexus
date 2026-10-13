import { SignedInSession } from './signed-in-session';

export type OpenedEmployeeWorkspace = {
  session: SignedInSession;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
