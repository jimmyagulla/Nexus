import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PRESENCE_MONTH_PATTERN } from '@hexagonal-monorepo-template/domain';

export class OpenPresenceRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ example: '2026-10' })
  @IsString()
  @Matches(PRESENCE_MONTH_PATTERN)
  month!: string;
}
