import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IGetCompanySettings,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { toCompanySettingsResponse } from './company-settings.mapper';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';
import { UpdateNonWorkingWeekdaysRequestDto } from './dto/update-non-working-weekdays-request.dto';

@ApiTags('company')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
@Roles(UserRole.EMPLOYER)
export class CompanySettingsController {
  constructor(
    @Inject(IGetCompanySettings)
    private readonly getCompanySettings: IGetCompanySettings,
    @Inject(ISetNonWorkingWeekdays)
    private readonly setNonWorkingWeekdays: ISetNonWorkingWeekdays,
  ) {}

  @Get(API_ROUTES.companies.settings)
  @ApiOperation({ summary: 'Get company settings' })
  async getSettings(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.getCompanySettings.execute({
      actor,
      companyId,
    });
    return toCompanySettingsResponse(settings);
  }

  @Put(API_ROUTES.companies.nonWorkingWeekdays)
  @ApiOperation({ summary: 'Update habitual non-working weekdays' })
  async updateWeekdays(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: UpdateNonWorkingWeekdaysRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.setNonWorkingWeekdays.execute({
      actor,
      companyId,
      weekdays: body.weekdays,
    });
    return toCompanySettingsResponse(settings);
  }
}
