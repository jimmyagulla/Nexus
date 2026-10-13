import {
  AccountStatus,
  AccountSummary,
  ErrorCode,
  InvitedAccount,
} from '@hexagonal-monorepo-template/domain';
import { AppRoutes } from '../../infrastructure/ui/routes/app-routes';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

export interface AccountRowViewModel {
  id: string;
  identifier: string;
  roleLabel: string;
  statusLabel: string;
  blockedMessage: string | null;
  canDisable: boolean;
  canRestore: boolean;
}

export interface CompanyAccountsViewModel {
  rows: AccountRowViewModel[];
}

export interface InvitationViewModel {
  identifier: string;
  activationPath: string;
}

export class CompanyAccountsPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  presentInvitation(invited: InvitedAccount): InvitationViewModel {
    return {
      identifier: invited.identifier,
      activationPath: `${AppRoutes.activation}?token=${encodeURIComponent(invited.invitationToken)}`,
    };
  }

  present(accounts: readonly AccountSummary[]): CompanyAccountsViewModel {
    return { rows: accounts.map((account) => this.presentRow(account)) };
  }

  private presentRow(account: AccountSummary): AccountRowViewModel {
    const { accounts, errors } = this.i18n.messages;
    return {
      id: account.id,
      identifier: account.identifier,
      roleLabel: accounts.roles[account.role],
      statusLabel: accounts.statuses[account.status],
      blockedMessage: account.locked ? errors[ErrorCode.ACCOUNT_LOCKED] : null,
      canDisable: account.status === AccountStatus.ACTIVE,
      canRestore: account.status === AccountStatus.DISABLED || account.locked,
    };
  }
}
