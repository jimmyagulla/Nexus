import {
  Body,
  Controller,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isWeekday } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  ICreateCompanyInboundPort,
  IUpdateCompanyNameInboundPort,
  IUpdateNonWorkingWeekdaysInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { toCompanySettingsResponse } from '../company-settings/company-settings.mapper';
import { CompanySettingsResponseDto } from '../company-settings/dto/company-settings-response.dto';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyNameRequestDto } from './dto/update-company-name-request.dto';
import { UpdateNonWorkingWeekdaysRequestDto } from './dto/update-non-working-weekdays-request.dto';

@ApiTags('company')
@Controller(API_ROUTES.companies.base)
export class CompanyController {
  constructor(
    @Inject(ICreateCompanyInboundPort)
    private readonly createCompany: ICreateCompanyInboundPort,
    @Inject(IUpdateCompanyNameInboundPort)
    private readonly updateCompanyName: IUpdateCompanyNameInboundPort,
    @Inject(IUpdateNonWorkingWeekdaysInboundPort)
    private readonly updateNonWorkingWeekdays: IUpdateNonWorkingWeekdaysInboundPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a company' })
  async create(
    @Body() body: CreateCompanyRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.createCompany.execute(body.name);
    return toCompanySettingsResponse(company);
  }

  @Patch(API_ROUTES.companies.name)
  @ApiHeader({ name: 'x-company-id', required: true })
  @ApiOperation({ summary: 'Update company name' })
  async updateName(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateCompanyNameRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanyName.execute({
      companyId,
      actorCompanyId,
      name: body.name,
    });
    return toCompanySettingsResponse(company);
  }

  @Put(API_ROUTES.companies.nonWorkingWeekdays)
  @ApiHeader({ name: 'x-company-id', required: true })
  @ApiOperation({ summary: 'Update non-working weekdays' })
  async updateWeekdays(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateNonWorkingWeekdaysRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateNonWorkingWeekdays.execute({
      companyId,
      actorCompanyId,
      weekdays: body.weekdays.filter(isWeekday),
    });
    return toCompanySettingsResponse(company);
  }
}
