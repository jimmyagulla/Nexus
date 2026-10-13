import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IAdjustPresenceWorkedDays,
  IGetPresence,
  IListPresences,
  IOpenPresence,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { AdjustWorkedDaysRequestDto } from './dto/adjust-worked-days-request.dto';
import { ListPresencesQueryDto } from './dto/list-presences-query.dto';
import { OpenPresenceRequestDto } from './dto/open-presence-request.dto';
import { PresenceListResponseDto } from './dto/presence-list-response.dto';
import { PresenceResponseDto } from './dto/presence-response.dto';
import { toPresenceListResponse, toPresenceResponse } from './presence.mapper';

@ApiTags('presence')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class PresenceController {
  constructor(
    @Inject(IOpenPresence) private readonly openPresence: IOpenPresence,
    @Inject(IListPresences) private readonly listPresences: IListPresences,
    @Inject(IGetPresence) private readonly getPresence: IGetPresence,
    @Inject(IAdjustPresenceWorkedDays)
    private readonly adjustPresence: IAdjustPresenceWorkedDays,
  ) {}

  @Get(API_ROUTES.companies.presence)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Read one presence month' })
  async get(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('presenceId') presenceId: string,
  ): Promise<PresenceResponseDto> {
    const presence = await this.getPresence.execute({
      actor,
      companyId,
      presenceId,
    });
    return toPresenceResponse(presence);
  }

  @Get(API_ROUTES.companies.presences)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'List the presence months the actor may read' })
  async list(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Query() query: ListPresencesQueryDto,
  ): Promise<PresenceListResponseDto> {
    const list = await this.listPresences.execute({
      actor,
      companyId,
      employeeId: query.employeeId,
      from: query.from,
      to: query.to,
    });
    return toPresenceListResponse(list);
  }

  @Patch(API_ROUTES.companies.presenceWorkedDays)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Correct the worked days of a presence month' })
  async adjustWorkedDays(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('presenceId') presenceId: string,
    @Body() body: AdjustWorkedDaysRequestDto,
  ): Promise<PresenceResponseDto> {
    const presence = await this.adjustPresence.execute({
      actor,
      companyId,
      presenceId,
      workedDays: body.workedDays,
    });
    return toPresenceResponse(presence);
  }

  @Post(API_ROUTES.companies.presences)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Open the presence month of an employee' })
  async open(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: OpenPresenceRequestDto,
  ): Promise<PresenceResponseDto> {
    const presence = await this.openPresence.execute({
      actor,
      companyId,
      employeeId: body.employeeId,
      month: body.month,
    });
    return toPresenceResponse(presence);
  }
}
