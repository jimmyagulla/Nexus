import {
  Body,
  Controller,
  Delete,
  Get,
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
  IAddCompanyHolidayInboundPort,
  IGetCompanySettingsInboundPort,
  IRemoveCompanyHolidayInboundPort,
  IUpdateCompanyHolidayInboundPort,
  IUpdateCompanyNameInboundPort,
  IUpdateNonWorkingWeekdaysInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsResponseDto } from '../company/dto/company-settings-response.dto';
import { HolidayRequestDto } from '../company/dto/holiday-request.dto';
import { UpdateCompanyNameRequestDto } from '../company/dto/update-company-name-request.dto';
import { UpdateNonWorkingWeekdaysRequestDto } from '../company/dto/update-non-working-weekdays-request.dto';
import { toCompanySettingsResponse } from '../company/company.mapper';
import { toHttpException } from '../common/to-http-exception';

@ApiTags('company-settings')
@ApiHeader({ name: 'x-company-id', required: true })
@Controller(API_ROUTES.companies.base)
export class CompanySettingsController {
  constructor(
    @Inject(IGetCompanySettingsInboundPort)
    private readonly getCompanySettings: IGetCompanySettingsInboundPort,
    @Inject(IUpdateCompanyNameInboundPort)
    private readonly updateCompanyName: IUpdateCompanyNameInboundPort,
    @Inject(IUpdateNonWorkingWeekdaysInboundPort)
    private readonly updateNonWorkingWeekdays: IUpdateNonWorkingWeekdaysInboundPort,
    @Inject(IAddCompanyHolidayInboundPort)
    private readonly addCompanyHoliday: IAddCompanyHolidayInboundPort,
    @Inject(IUpdateCompanyHolidayInboundPort)
    private readonly updateCompanyHoliday: IUpdateCompanyHolidayInboundPort,
    @Inject(IRemoveCompanyHolidayInboundPort)
    private readonly removeCompanyHoliday: IRemoveCompanyHolidayInboundPort,
  ) {}

  @Get(API_ROUTES.companies.settings)
  @ApiOperation({ summary: 'Get company settings' })
  async settings(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.getCompanySettings.execute({
        companyId,
        actorCompanyId,
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Patch(API_ROUTES.companies.name)
  @ApiOperation({ summary: 'Update company name' })
  async updateName(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateCompanyNameRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.updateCompanyName.execute({
        companyId,
        actorCompanyId,
        name: body.name,
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Put(API_ROUTES.companies.nonWorkingWeekdays)
  @ApiOperation({ summary: 'Update non-working weekdays' })
  async updateWeekdays(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateNonWorkingWeekdaysRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.updateNonWorkingWeekdays.execute({
        companyId,
        actorCompanyId,
        weekdays: body.weekdays.filter(isWeekday),
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Post(API_ROUTES.companies.holidays)
  @ApiOperation({ summary: 'Add a public holiday' })
  async addHoliday(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.addCompanyHoliday.execute({
        companyId,
        actorCompanyId,
        date: body.date,
        label: body.label,
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Patch(API_ROUTES.companies.holiday)
  @ApiOperation({ summary: 'Update a public holiday' })
  async updateHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.updateCompanyHoliday.execute({
        companyId,
        actorCompanyId,
        holidayId,
        date: body.date,
        label: body.label,
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Delete(API_ROUTES.companies.holiday)
  @ApiOperation({ summary: 'Remove a public holiday' })
  async removeHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
  ): Promise<CompanySettingsResponseDto> {
    try {
      const company = await this.removeCompanyHoliday.execute({
        companyId,
        actorCompanyId,
        holidayId,
      });
      return toCompanySettingsResponse(company);
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
