import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { PublicHolidayResponseDto } from '../../company-public-holidays/dto/public-holiday-response.dto';

export class CompanySettingsResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: DayOfWeek, isArray: true })
  nonWorkingWeekdays!: DayOfWeek[];

  @ApiProperty({ type: [PublicHolidayResponseDto] })
  publicHolidays!: PublicHolidayResponseDto[];
}
