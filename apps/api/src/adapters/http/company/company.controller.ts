import {
  Body,
  Controller,
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
  ICreateCompany,
  IRenameCompany,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { AllowWithoutCompany } from '../common/guards/company-scope/allow-without-company.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { toCompanySettingsResponse } from '../company-settings/company-settings.mapper';
import { CompanySettingsResponseDto } from '../company-settings/dto/company-settings-response.dto';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyNameRequestDto } from './dto/update-company-name-request.dto';

@ApiTags('company')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class CompanyController {
  constructor(
    @Inject(ICreateCompany)
    private readonly createCompany: ICreateCompany,
    @Inject(IRenameCompany)
    private readonly renameCompany: IRenameCompany,
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
}
