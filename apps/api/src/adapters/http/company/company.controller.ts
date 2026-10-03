import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  API_ROUTES,
  ICreateCompanyInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';
import { toCompanySettingsResponse } from './company.mapper';
import { toHttpException } from '../common/to-http-exception';

@ApiTags('company')
@Controller(API_ROUTES.companies.base)
export class CompanyController {
  constructor(
    @Inject(ICreateCompanyInboundPort)
    private readonly createCompany: ICreateCompanyInboundPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a company' })
  async create(
    @Body() body: CreateCompanyRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.createCompany.execute(body.name);
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
