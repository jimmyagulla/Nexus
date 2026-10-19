import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  EXPENSE_REPORT_STATUSES,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';

export class ChangeExpenseReportStatusRequestDto {
  @ApiProperty({ enum: EXPENSE_REPORT_STATUSES })
  @IsIn(EXPENSE_REPORT_STATUSES)
  status!: ExpenseReportStatus;
}
