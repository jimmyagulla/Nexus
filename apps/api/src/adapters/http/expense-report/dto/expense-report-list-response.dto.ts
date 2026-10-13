import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportResponseDto } from './expense-report-response.dto';

export class ExpenseReportListResponseDto {
  @ApiProperty()
  canCreate!: boolean;

  @ApiProperty({ description: 'Sum of the totals of the listed reports' })
  totalAmount!: number;

  @ApiProperty({ type: [ExpenseReportResponseDto] })
  reports!: ExpenseReportResponseDto[];
}
