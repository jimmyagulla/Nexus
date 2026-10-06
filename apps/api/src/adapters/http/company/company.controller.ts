import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  ICreateCompany,
  IGetCompanySettings,
  IRenameCompany,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/actor.decorator';
import { AllowWithoutCompany } from '../common/guards/allow-without-company.decorator';
import { Roles } from '../common/guards/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyScopeGuard } from '../common/guards/company-scope.guard';
import { toCompanySettingsResponse } from './company-settings.mapper';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyNameRequestDto } from './dto/update-company-name-request.dto';
import { UpdateNonWorkingWeekdaysRequestDto } from './dto/update-non-working-weekdays-request.dto';

@ApiTags('company')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class CompanyController {
  constructor(
    @Inject(ICreateCompany)
    private readonly createCompany: ICreateCompany,
    @Inject(IGetCompanySettings)
    private readonly getCompanySettings: IGetCompanySettings,
    @Inject(IRenameCompany)
    private readonly renameCompany: IRenameCompany,
    @Inject(ISetNonWorkingWeekdays)
    private readonly setNonWorkingWeekdays: ISetNonWorkingWeekdays,
  ) {}

  @Post()
  @AllowWithoutCompany()
  @ApiOperation({ summary: 'Create a company' })
  async create(
    @Actor() actor: ActorContext,
    @Body() body: CreateCompanyRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.createCompany.execute({
      actor,
      name: body.name,
    });
    return toCompanySettingsResponse(company);
  }

  @Get(API_ROUTES.companies.settings)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Get company settings' })
  async getSettings(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.getCompanySettings.execute({ actor, companyId });
    return toCompanySettingsResponse(settings);
  }

  @Patch(API_ROUTES.companies.name)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Rename a company' })
  async updateName(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: UpdateCompanyNameRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const settings = await this.renameCompany.execute({
      actor,
      companyId,
      name: body.name,
    });
    return toCompanySettingsResponse(settings);
  }

  @Put(API_ROUTES.companies.nonWorkingWeekdays)
  @Roles(UserRole.EMPLOYER)
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
