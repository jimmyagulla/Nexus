import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportCategoryCountsResponseDto } from './expense-report-category-counts-response.dto';
import { ExpenseReportProjectCountResponseDto } from './expense-report-project-count-response.dto';
import { ExpenseReportProofCountsResponseDto } from './expense-report-proof-counts-response.dto';
import { ExpenseReportStatsResponseDto } from './expense-report-stats-response.dto';
import { ExpenseReportStatusCountsResponseDto } from './expense-report-status-counts-response.dto';
import { ExpenseReportSummaryResponseDto } from './expense-report-summary-response.dto';

export class ExpenseReportListResponseDto {
  @ApiProperty({ type: [ExpenseReportSummaryResponseDto] })
  items!: ExpenseReportSummaryResponseDto[];

  @ApiProperty({ description: 'Every report of the owner, whatever the criteria' })
  total!: number;

  @ApiProperty({ type: ExpenseReportCategoryCountsResponseDto })
  categoryCounts!: ExpenseReportCategoryCountsResponseDto;

  @ApiProperty({ type: ExpenseReportStatusCountsResponseDto })
  statusCounts!: ExpenseReportStatusCountsResponseDto;

  @ApiProperty({ type: ExpenseReportProofCountsResponseDto })
  proofCounts!: ExpenseReportProofCountsResponseDto;

  @ApiProperty({ type: [ExpenseReportProjectCountResponseDto] })
  projectCounts!: ExpenseReportProjectCountResponseDto[];

  @ApiProperty({ type: ExpenseReportStatsResponseDto })
  stats!: ExpenseReportStatsResponseDto;
}
