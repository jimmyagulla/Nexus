import { ApiProperty } from '@nestjs/swagger';
import { HolidayResponseDto } from './holiday-response.dto';

export class CompanySettingsResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [Number] })
  nonWorkingWeekdays!: number[];

  @ApiProperty({ type: [HolidayResponseDto] })
  holidays!: HolidayResponseDto[];
}
