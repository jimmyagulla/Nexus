import { Body, Controller, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import { API_ROUTES, IInviteEmployee } from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { EmployeeInvitationResponseDto } from './dto/employee-invitation-response.dto';
import { InviteEmployeeRequestDto } from './dto/invite-employee-request.dto';

@ApiTags('employee')
@ApiBearerAuth()
@Controller(API_ROUTES.employees.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class EmployeeController {
  constructor(
    @Inject(IInviteEmployee)
    private readonly inviteEmployee: IInviteEmployee,
  ) {}

  @Post(API_ROUTES.employees.invitation)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Invite an active employee to open an account' })
  invite(
    @Actor() actor: ActorContext,
    @Param('employeeId') employeeId: string,
    @Body() body: InviteEmployeeRequestDto,
  ): Promise<EmployeeInvitationResponseDto> {
    return this.inviteEmployee.execute({
      actor,
      employeeId,
      identifier: body.identifier,
    });
  }
}
