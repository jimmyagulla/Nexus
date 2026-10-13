import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetConnectionStatus } from '../entities/cabinet-connection-status';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireConnectedCabinet } from './require-connected-cabinet';

const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const connection = (status: CabinetConnectionStatus) =>
  new CabinetConnection('c1', status);

describe('requireConnectedCabinet', () => {
  it('lets the connected cabinet of the company through', () => {
    expect(() =>
      requireConnectedCabinet(
        accountant,
        'c1',
        connection(CabinetConnectionStatus.CONNECTED),
      ),
    ).not.toThrow();
  });

  it('refuses a revoked cabinet', () => {
    expect(() =>
      requireConnectedCabinet(
        accountant,
        'c1',
        connection(CabinetConnectionStatus.REVOKED),
      ),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a cabinet that did not accept the invitation yet', () => {
    expect(() =>
      requireConnectedCabinet(
        accountant,
        'c1',
        connection(CabinetConnectionStatus.INVITATION_SENT),
      ),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a company without cabinet', () => {
    expect(() => requireConnectedCabinet(accountant, 'c1', null)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an actor who is not a cabinet', () => {
    for (const role of [UserRole.EMPLOYER, UserRole.EMPLOYEE, null]) {
      expect(() =>
        requireConnectedCabinet(
          { ...accountant, role },
          'c1',
          connection(CabinetConnectionStatus.CONNECTED),
        ),
      ).toThrow(ErrorCode.ACCESS_DENIED);
    }
  });

  it('refuses the cabinet of another company', () => {
    expect(() =>
      requireConnectedCabinet(
        { ...accountant, companyId: 'c2' },
        'c1',
        connection(CabinetConnectionStatus.CONNECTED),
      ),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
