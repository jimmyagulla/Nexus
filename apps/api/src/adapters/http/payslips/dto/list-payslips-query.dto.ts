import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  PAYSLIP_MAX_YEAR,
  PAYSLIP_MIN_YEAR,
} from '@hexagonal-monorepo-template/domain';

export class ListPayslipsQueryDto {
  @ApiPropertyOptional({
    description: 'Year of the payslips; every year when absent',
    minimum: PAYSLIP_MIN_YEAR,
    maximum: PAYSLIP_MAX_YEAR,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAYSLIP_MIN_YEAR)
  @Max(PAYSLIP_MAX_YEAR)
  year?: number;
}
