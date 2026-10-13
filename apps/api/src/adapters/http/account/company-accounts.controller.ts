import { Body, Controller, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IDisableAccount,
  IInviteEmployer,
  IRestoreAccount,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { AccountSummaryResponseDto } from './dto/account-summary-response.dto';
import { InviteEmployerRequestDto } from './dto/invite-employer-request.dto';
import { InvitedAccountResponseDto } from './dto/invited-account-response.dto';

@ApiTags('account')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
@Roles(UserRole.EMPLOYER)
export class CompanyAccountsController {
  constructor(
    @Inject(IInviteEmployer)
    private readonly inviteEmployer: IInviteEmployer,
    @Inject(IDisableAccount)
    private readonly disableAccount: IDisableAccount,
    @Inject(IRestoreAccount)
    private readonly restoreAccount: IRestoreAccount,
  ) {}

  @Post(API_ROUTES.companies.accounts)
  @ApiOperation({ summary: 'Invite another employer into the company' })
  invite(
    @Actor() actor: ActorContext,
    @Body() body: InviteEmployerRequestDto,
  ): Promise<InvitedAccountResponseDto> {
    return this.inviteEmployer.execute({
      actor,
      identifier: body.identifier,
    });
  }

  @Post(API_ROUTES.companies.accountDisable)
  @ApiOperation({ summary: 'Disable an active account of the company' })
  disable(
    @Actor() actor: ActorContext,
    @Param('accountId') accountId: string,
  ): Promise<AccountSummaryResponseDto> {
    return this.disableAccount.execute({ actor, accountId });
  }

  @Post(API_ROUTES.companies.accountRestore)
  @ApiOperation({ summary: 'Restore a disabled or locked account' })
  restore(
    @Actor() actor: ActorContext,
    @Param('accountId') accountId: string,
  ): Promise<AccountSummaryResponseDto> {
    return this.restoreAccount.execute({ actor, accountId });
  }
}
