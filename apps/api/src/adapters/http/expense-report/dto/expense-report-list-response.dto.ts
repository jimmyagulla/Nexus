import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportResponseDto } from './expense-report-response.dto';

export class ExpenseReportListResponseDto {
  @ApiProperty()
  canCreate!: boolean;

  @ApiProperty({ type: [ExpenseReportResponseDto] })
  reports!: ExpenseReportResponseDto[];
}
