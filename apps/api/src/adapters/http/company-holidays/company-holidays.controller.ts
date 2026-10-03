import {
  Body,
  Controller,
  Delete,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  API_ROUTES,
  IAddCompanyHolidayInboundPort,
  IRemoveCompanyHolidayInboundPort,
  IUpdateCompanyHolidayInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { toCompanySettingsResponse } from '../company-settings/company-settings.mapper';
import { CompanySettingsResponseDto } from '../company-settings/dto/company-settings-response.dto';
import { HolidayRequestDto } from './dto/holiday-request.dto';

@ApiTags('company-holidays')
@ApiHeader({ name: 'x-company-id', required: true })
@Controller(API_ROUTES.companies.base)
export class CompanyHolidaysController {
  constructor(
    @Inject(IAddCompanyHolidayInboundPort)
    private readonly addCompanyHoliday: IAddCompanyHolidayInboundPort,
    @Inject(IUpdateCompanyHolidayInboundPort)
    private readonly updateCompanyHoliday: IUpdateCompanyHolidayInboundPort,
    @Inject(IRemoveCompanyHolidayInboundPort)
    private readonly removeCompanyHoliday: IRemoveCompanyHolidayInboundPort,
  ) {}

  @Post(API_ROUTES.companies.holidays)
  @ApiOperation({ summary: 'Add a public holiday' })
  async addHoliday(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.addCompanyHoliday.execute({
      companyId,
      actorCompanyId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(company);
  }

  @Patch(API_ROUTES.companies.holiday)
  @ApiOperation({ summary: 'Update a public holiday' })
  async updateHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanyHoliday.execute({
      companyId,
      actorCompanyId,
      holidayId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(company);
  }

  @Delete(API_ROUTES.companies.holiday)
  @ApiOperation({ summary: 'Remove a public holiday' })
  async removeHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.removeCompanyHoliday.execute({
      companyId,
      actorCompanyId,
      holidayId,
    });
    return toCompanySettingsResponse(company);
  }
}
