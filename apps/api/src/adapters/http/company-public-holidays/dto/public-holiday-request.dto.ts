import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { CALENDAR_DATE_PATTERN } from '@hexagonal-monorepo-template/domain';

export class PublicHolidayRequestDto {
  @ApiProperty()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  date!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;
}
