import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  API_ROUTES,
  IConfirmSecondFactorEnrollment,
} from '@hexagonal-monorepo-template/ports';
import { Public } from '../common/guards/auth/public.decorator';
import { ConfirmSecondFactorEnrollmentRequestDto } from './dto/confirm-second-factor-enrollment-request.dto';
import { OpenedEmployeeWorkspaceResponseDto } from './dto/opened-employee-workspace-response.dto';

@ApiTags('second-factor')
@Controller(API_ROUTES.secondFactor.base)
export class SecondFactorEnrollmentController {
  constructor(
    @Inject(IConfirmSecondFactorEnrollment)
    private readonly confirmEnrollment: IConfirmSecondFactorEnrollment,
  ) {}

  @Post(API_ROUTES.secondFactor.enrollmentConfirmation)
  @Public()
  @ApiOperation({
    summary: 'Confirm the second factor enrollment and open the workspace',
  })
  confirm(
    @Body() body: ConfirmSecondFactorEnrollmentRequestDto,
  ): Promise<OpenedEmployeeWorkspaceResponseDto> {
    return this.confirmEnrollment.execute({
      enrollmentId: body.enrollmentId,
      code: body.code,
    });
  }
}
