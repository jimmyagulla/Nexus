import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IBeginSecondFactorEnrollment,
  IConfirmSecondFactorEnrollment,
  IVerifySecondFactor,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ConfirmSecondFactorRequestDto } from './dto/confirm-second-factor-request.dto';
import { SecondFactorEnrollmentConfirmationResponseDto } from './dto/second-factor-enrollment-confirmation-response.dto';
import { SecondFactorEnrollmentResponseDto } from './dto/second-factor-enrollment-response.dto';
import { SecondFactorVerificationResponseDto } from './dto/second-factor-verification-response.dto';
import { VerifySecondFactorRequestDto } from './dto/verify-second-factor-request.dto';

@ApiTags('second-factor')
@ApiBearerAuth()
@Controller(API_ROUTES.secondFactor.base)
@UseGuards(RolesGuard)
@Roles(UserRole.EMPLOYEE)
export class SecondFactorController {
  constructor(
    @Inject(IBeginSecondFactorEnrollment)
    private readonly beginEnrollment: IBeginSecondFactorEnrollment,
    @Inject(IConfirmSecondFactorEnrollment)
    private readonly confirmEnrollment: IConfirmSecondFactorEnrollment,
    @Inject(IVerifySecondFactor)
    private readonly verifySecondFactor: IVerifySecondFactor,
  ) {}

  @Post(API_ROUTES.secondFactor.enrollment)
  @ApiOperation({ summary: 'Begin the second factor enrollment' })
  async begin(
    @Actor() actor: ActorContext,
  ): Promise<SecondFactorEnrollmentResponseDto> {
    const enrollment = await this.beginEnrollment.execute({ actor });
    return {
      secret: enrollment.secret,
      provisioningUri: enrollment.provisioningUri,
    };
  }

  @Post(API_ROUTES.secondFactor.enrollmentConfirmation)
  @ApiOperation({
    summary: 'Confirm the second factor enrollment and hand over the recovery codes',
  })
  async confirm(
    @Actor() actor: ActorContext,
    @Body() body: ConfirmSecondFactorRequestDto,
  ): Promise<SecondFactorEnrollmentConfirmationResponseDto> {
    const confirmation = await this.confirmEnrollment.execute({
      actor,
      code: body.code,
    });
    return {
      enrolled: confirmation.enrolled,
      recoveryCodes: [...confirmation.recoveryCodes],
    };
  }

  @Post(API_ROUTES.secondFactor.verification)
  @ApiOperation({
    summary: 'Verify the second factor with the usual code or a recovery code',
  })
  async verify(
    @Actor() actor: ActorContext,
    @Body() body: VerifySecondFactorRequestDto,
  ): Promise<SecondFactorVerificationResponseDto> {
    const verification = await this.verifySecondFactor.execute({
      actor,
      code: body.code,
    });
    return { verified: verification.verified };
  }
}
