import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IListPresences,
  IOpenPresence,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
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
  ) {}

  @Get(API_ROUTES.companies.presences)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'List the presence months of the company' })
  async list(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<PresenceListResponseDto> {
    const list = await this.listPresences.execute({ actor, companyId });
    return toPresenceListResponse(list);
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
