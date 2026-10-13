import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IBeginSecondFactorEnrollment,
  IConfirmSecondFactorEnrollment,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ConfirmSecondFactorRequestDto } from './dto/confirm-second-factor-request.dto';
import { SecondFactorEnrollmentConfirmationResponseDto } from './dto/second-factor-enrollment-confirmation-response.dto';
import { SecondFactorEnrollmentResponseDto } from './dto/second-factor-enrollment-response.dto';

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
  @ApiOperation({ summary: 'Confirm the second factor enrollment' })
  async confirm(
    @Actor() actor: ActorContext,
    @Body() body: ConfirmSecondFactorRequestDto,
  ): Promise<SecondFactorEnrollmentConfirmationResponseDto> {
    const confirmation = await this.confirmEnrollment.execute({
      actor,
      code: body.code,
    });
    return { enrolled: confirmation.enrolled };
  }
}
