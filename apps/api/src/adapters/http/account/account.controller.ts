import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_ROUTES, IActivateAccount } from '@hexagonal-monorepo-template/ports';
import { Public } from '../common/guards/auth/public.decorator';
import { ActivateAccountRequestDto } from './dto/activate-account-request.dto';

@ApiTags('account')
@Controller(API_ROUTES.accounts.base)
export class AccountController {
  constructor(
    @Inject(IActivateAccount)
    private readonly activateAccount: IActivateAccount,
  ) {}

  @Post(API_ROUTES.accounts.activation)
  @Public()
  @ApiOperation({ summary: 'Activate an invited account' })
  async activate(@Body() body: ActivateAccountRequestDto): Promise<void> {
    await this.activateAccount.execute({
      invitationToken: body.invitationToken,
      secret: body.secret,
    });
  }
}
