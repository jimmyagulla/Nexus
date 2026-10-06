import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IAddCompanyPublicHoliday,
  IRemoveCompanyPublicHoliday,
  IUpdateCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { toCompanySettingsResponse } from '../company-settings/company-settings.mapper';
import { CompanySettingsResponseDto } from '../company-settings/dto/company-settings-response.dto';
import { PublicHolidayRequestDto } from './dto/public-holiday-request.dto';

@ApiTags('company')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
@Roles(UserRole.EMPLOYER)
export class CompanyPublicHolidaysController {
  constructor(
    @Inject(IAddCompanyPublicHoliday)
    private readonly addHoliday: IAddCompanyPublicHoliday,
    @Inject(IUpdateCompanyPublicHoliday)
    private readonly updateHoliday: IUpdateCompanyPublicHoliday,
    @Inject(IRemoveCompanyPublicHoliday)
    private readonly removeHoliday: IRemoveCompanyPublicHoliday,
  ) {}

  @Post(API_ROUTES.companies.publicHolidays)
  @ApiOperation({ summary: 'Retain a public holiday' })
  async add(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: PublicHolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.addHoliday.execute({
      actor,
      companyId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(settings);
  }

  @Patch(API_ROUTES.companies.publicHoliday)
  @ApiOperation({ summary: 'Update a retained public holiday' })
  async update(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('publicHolidayId') publicHolidayId: string,
    @Body() body: PublicHolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.updateHoliday.execute({
      actor,
      companyId,
      publicHolidayId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(settings);
  }

  @Delete(API_ROUTES.companies.publicHoliday)
  @ApiOperation({ summary: 'Remove a retained public holiday' })
  async remove(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('publicHolidayId') publicHolidayId: string,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.removeHoliday.execute({
      actor,
      companyId,
      publicHolidayId,
    });
    return toCompanySettingsResponse(settings);
  }
}
