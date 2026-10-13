import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  CALENDAR_DATE_PATTERN,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';

export class ExpenseReportFilterQueryDto {
  @ApiPropertyOptional({ description: 'Employer only: reports of one employee' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ enum: ExpenseReportStatus })
  @IsOptional()
  @IsEnum(ExpenseReportStatus)
  status?: ExpenseReportStatus;

  @ApiPropertyOptional({ description: 'First day of the period (YYYY-MM-DD)' })
  @IsOptional()
  @Matches(CALENDAR_DATE_PATTERN)
  from?: string;

  @ApiPropertyOptional({ description: 'Last day of the period (YYYY-MM-DD)' })
  @IsOptional()
  @Matches(CALENDAR_DATE_PATTERN)
  to?: string;

  @ApiPropertyOptional({ description: 'Minimum total, in euros' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum total, in euros' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;
}
