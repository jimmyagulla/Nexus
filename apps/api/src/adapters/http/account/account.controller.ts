import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  API_ROUTES,
  IActivateAccount,
  IActivateEmployeeAccount,
  ISignIn,
} from '@hexagonal-monorepo-template/ports';
import { Public } from '../common/guards/auth/public.decorator';
import { ActivateAccountRequestDto } from './dto/activate-account-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignedInSessionResponseDto } from './dto/signed-in-session-response.dto';

@ApiTags('account')
@Controller(API_ROUTES.accounts.base)
export class AccountController {
  constructor(
    @Inject(IActivateAccount)
    private readonly activateAccount: IActivateAccount,
    @Inject(IActivateEmployeeAccount)
    private readonly activateEmployeeAccount: IActivateEmployeeAccount,
    @Inject(ISignIn)
    private readonly signIn: ISignIn,
  ) {}

  @Post(API_ROUTES.accounts.employeeActivation)
  @Public()
  @ApiOperation({ summary: 'Activate an invited employee account' })
  async activateEmployee(
    @Body() body: ActivateAccountRequestDto,
  ): Promise<void> {
    await this.activateEmployeeAccount.execute({
      invitationToken: body.invitationToken,
      secret: body.secret,
    });
  }

  @Post(API_ROUTES.accounts.activation)
  @Public()
  @ApiOperation({ summary: 'Activate an invited account' })
  async activate(@Body() body: ActivateAccountRequestDto): Promise<void> {
    await this.activateAccount.execute({
      invitationToken: body.invitationToken,
      secret: body.secret,
    });
  }

  @Post(API_ROUTES.accounts.signIn)
  @Public()
  @ApiOperation({ summary: 'Sign in with identifier and secret' })
  signInWithSecret(
    @Body() body: SignInRequestDto,
  ): Promise<SignedInSessionResponseDto> {
    return this.signIn.execute({
      identifier: body.identifier,
      secret: body.secret,
    });
  }
}
