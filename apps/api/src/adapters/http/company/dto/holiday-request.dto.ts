import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class HolidayRequestDto {
  @ApiProperty({ example: '2026-07-14' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 'Fête nationale' })
  @IsString()
  @IsNotEmpty()
  label!: string;
}
