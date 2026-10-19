import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  CALENDAR_DATE_PATTERN,
  EXPENSE_AMOUNT_PATTERN,
  EXPENSE_REPORT_CATEGORIES,
  EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH,
  EXPENSE_REPORT_PAYMENT_METHODS,
  EXPENSE_REPORT_PROJECT_MAX_LENGTH,
  EXPENSE_VAT_RATES,
  ExpenseReportCategory,
  ExpenseReportPaymentMethod,
  ExpenseVatRate,
} from '@hexagonal-monorepo-template/domain';

/** A form field arrives as text: "10" → 10, anything else is kept for the validator. */
const asNumber = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' && value.trim() !== '' ? Number(value) : value;

/** Text fields of a new expense report. The receipt travels in the `proof` part. */
export class SubmitExpenseReportRequestDto {
  @ApiProperty({ description: 'Day of the expense (YYYY-MM-DD)' })
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  date!: string;

  @ApiProperty({ enum: EXPENSE_REPORT_CATEGORIES })
  @IsIn(EXPENSE_REPORT_CATEGORIES)
  category!: ExpenseReportCategory;

  @ApiProperty({ enum: EXPENSE_REPORT_PAYMENT_METHODS })
  @IsIn(EXPENSE_REPORT_PAYMENT_METHODS)
  paymentMethod!: ExpenseReportPaymentMethod;

  @ApiProperty({ description: 'Amount including VAT, "68,00" or "68.00"', example: '68.00' })
  @IsString()
  @Matches(EXPENSE_AMOUNT_PATTERN)
  amount!: string;

  @ApiPropertyOptional({ enum: EXPENSE_VAT_RATES, description: 'VAT rate in percent; none without VAT' })
  @IsOptional()
  @Transform(asNumber)
  @IsIn(EXPENSE_VAT_RATES)
  vatRate?: ExpenseVatRate;

  @ApiProperty({ maxLength: EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH)
  description!: string;

  @ApiPropertyOptional({ maxLength: EXPENSE_REPORT_PROJECT_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(EXPENSE_REPORT_PROJECT_MAX_LENGTH)
  project?: string;
}
