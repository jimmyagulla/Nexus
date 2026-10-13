import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { PRESENCE_MONTH_PATTERN } from '@hexagonal-monorepo-template/domain';

export class ListPresencesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employeeId?: string;

  @ApiPropertyOptional({ example: '2026-08' })
  @IsOptional()
  @IsString()
  @Matches(PRESENCE_MONTH_PATTERN)
  from?: string;

  @ApiPropertyOptional({ example: '2026-10' })
  @IsOptional()
  @IsString()
  @Matches(PRESENCE_MONTH_PATTERN)
  to?: string;
}
