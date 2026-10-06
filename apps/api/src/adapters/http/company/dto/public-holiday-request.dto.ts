import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PublicHolidayRequestDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;
}
