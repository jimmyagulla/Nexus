import { Controller, Get, Headers, Inject, Param } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  API_ROUTES,
  IGetCompanySettingsInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { toCompanySettingsResponse } from './company-settings.mapper';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';

@ApiTags('company-settings')
@ApiHeader({ name: 'x-company-id', required: true })
@Controller(API_ROUTES.companies.base)
export class CompanySettingsController {
  constructor(
    @Inject(IGetCompanySettingsInboundPort)
    private readonly getCompanySettings: IGetCompanySettingsInboundPort,
  ) {}

  @Get(API_ROUTES.companies.settings)
  @ApiOperation({ summary: 'Get company settings' })
  async settings(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.getCompanySettings.execute({
      companyId,
      actorCompanyId,
    });
    return toCompanySettingsResponse(company);
  }
}
