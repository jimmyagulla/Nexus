import { ApiProperty } from '@nestjs/swagger';
import {
  EXPENSE_REPORT_CATEGORIES,
  EXPENSE_REPORT_PAYMENT_METHODS,
  EXPENSE_REPORT_STATUSES,
  EXPENSE_VAT_RATES,
  ExpenseReportCategory,
  ExpenseReportPaymentMethod,
  ExpenseReportStatus,
  ExpenseVatRate,
} from '@hexagonal-monorepo-template/domain';
import { ExpenseReportProofSummaryResponseDto } from './expense-report-proof-summary-response.dto';

export class ExpenseReportSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Day of the expense (YYYY-MM-DD)' })
  date!: string;

  @ApiProperty({ enum: EXPENSE_REPORT_CATEGORIES })
  category!: ExpenseReportCategory;

  @ApiProperty({ enum: EXPENSE_REPORT_PAYMENT_METHODS })
  paymentMethod!: ExpenseReportPaymentMethod;

  @ApiProperty({ description: 'Amount including VAT', example: '68.00' })
  amount!: string;

  @ApiProperty({ enum: EXPENSE_VAT_RATES, nullable: true })
  vatRate!: ExpenseVatRate | null;

  @ApiProperty({ type: String, nullable: true, example: '6.18' })
  vatAmount!: string | null;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: String, nullable: true })
  project!: string | null;

  @ApiProperty({ type: ExpenseReportProofSummaryResponseDto, nullable: true })
  proof!: ExpenseReportProofSummaryResponseDto | null;

  @ApiProperty({ enum: EXPENSE_REPORT_STATUSES })
  status!: ExpenseReportStatus;

  @ApiProperty({ description: 'Its owner may still change it' })
  editable!: boolean;

  @ApiProperty({ description: 'ISO 8601 instant' })
  submittedAt!: string;

  @ApiProperty({ type: String, nullable: true, description: 'ISO 8601 instant of the refund or the refusal' })
  processedAt!: string | null;
}
