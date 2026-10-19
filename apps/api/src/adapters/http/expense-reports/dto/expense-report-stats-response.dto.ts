import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportPendingStatsResponseDto } from './expense-report-pending-stats-response.dto';
import { ExpenseReportRefundedStatsResponseDto } from './expense-report-refunded-stats-response.dto';

export class ExpenseReportStatsResponseDto {
  @ApiProperty({ type: ExpenseReportPendingStatsResponseDto })
  pending!: ExpenseReportPendingStatsResponseDto;

  @ApiProperty({ type: ExpenseReportRefundedStatsResponseDto })
  refunded!: ExpenseReportRefundedStatsResponseDto;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'Mean days from submission to refund or refusal',
  })
  averageProcessingDays!: number | null;
}
