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
  ICreateCompanyInboundPort,
  IGetCompanySettingsInboundPort,
  IUpdateCompanySettingsInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';
import { toCompanySettingsResponse } from './company.mapper';
import { UpdateCompanyNameRequestDto } from './dto/update-company-name-request.dto';
import { UpdateNonWorkingWeekdaysRequestDto } from './dto/update-non-working-weekdays-request.dto';
import { HolidayRequestDto } from './dto/holiday-request.dto';

@ApiTags('company')
@Controller('companies')
export class CompanyController {
  constructor(
    @Inject(ICreateCompanyInboundPort)
    private readonly createCompany: ICreateCompanyInboundPort,
    @Inject(IGetCompanySettingsInboundPort)
    private readonly getCompanySettings: IGetCompanySettingsInboundPort,
    @Inject(IUpdateCompanySettingsInboundPort)
    private readonly updateCompanySettings: IUpdateCompanySettingsInboundPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a company' })
  async create(@Body() body: CreateCompanyRequestDto): Promise<CompanySettingsResponseDto> {
    const company = await this.createCompany.execute(body.name);
    return toCompanySettingsResponse(company);
  }

  @Get(':companyId/settings')
  @ApiOperation({ summary: 'Get company settings' })
  @ApiHeader({ name: 'x-company-id', required: true })
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

  @Patch(':companyId/name')
  @ApiOperation({ summary: 'Update company name' })
  @ApiHeader({ name: 'x-company-id', required: true })
  async updateName(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateCompanyNameRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanySettings.updateName({
      companyId,
      actorCompanyId,
      name: body.name,
    });
    return toCompanySettingsResponse(company);
  }

  @Put(':companyId/calendar/non-working-weekdays')
  @ApiOperation({ summary: 'Update non-working weekdays' })
  @ApiHeader({ name: 'x-company-id', required: true })
  async updateWeekdays(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: UpdateNonWorkingWeekdaysRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const weekdays = body.weekdays.filter(isWeekday);
    const company = await this.updateCompanySettings.updateNonWorkingWeekdays({
      companyId,
      actorCompanyId,
      weekdays,
    });
    return toCompanySettingsResponse(company);
  }

  @Post(':companyId/calendar/holidays')
  @ApiOperation({ summary: 'Add a public holiday' })
  @ApiHeader({ name: 'x-company-id', required: true })
  async addHoliday(
    @Param('companyId') companyId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanySettings.addHoliday({
      companyId,
      actorCompanyId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(company);
  }

  @Patch(':companyId/calendar/holidays/:holidayId')
  @ApiOperation({ summary: 'Update a public holiday' })
  @ApiHeader({ name: 'x-company-id', required: true })
  async updateHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
    @Body() body: HolidayRequestDto,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanySettings.updateHoliday({
      companyId,
      actorCompanyId,
      holidayId,
      date: body.date,
      label: body.label,
    });
    return toCompanySettingsResponse(company);
  }

  @Delete(':companyId/calendar/holidays/:holidayId')
  @ApiOperation({ summary: 'Remove a public holiday' })
  @ApiHeader({ name: 'x-company-id', required: true })
  async removeHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Headers('x-company-id') actorCompanyId: string,
  ): Promise<CompanySettingsResponseDto> {
    const company = await this.updateCompanySettings.removeHoliday({
      companyId,
      actorCompanyId,
      holidayId,
    });
    return toCompanySettingsResponse(company);
  }
}
