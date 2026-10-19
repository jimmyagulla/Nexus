import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  CALENDAR_DATE_PATTERN,
  EXPENSE_AMOUNT_PATTERN,
  EXPENSE_REPORT_CATEGORIES,
  EXPENSE_REPORT_PROJECT_MAX_LENGTH,
  EXPENSE_REPORT_PROOF_PRESENCES,
  EXPENSE_REPORT_SEARCH_MAX_LENGTH,
  EXPENSE_REPORT_SORT_DIRECTIONS,
  EXPENSE_REPORT_SORTS,
  EXPENSE_REPORT_STATUSES,
  ExpenseReportCategory,
  ExpenseReportProofPresence,
  ExpenseReportSort,
  ExpenseReportSortDirection,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';

/** `a,b` in the query string → `['a', 'b']`. */
const commaSeparated = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter((item) => item !== '')
    : value;

/** A parameter repeated (`projects=a&projects=b`) arrives as a list, a single one as a string. */
const asList = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? [value] : value;

export class ListExpenseReportsQueryDto {
  @ApiPropertyOptional({ maxLength: EXPENSE_REPORT_SEARCH_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(EXPENSE_REPORT_SEARCH_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: 'Categories whose label matches the search, comma-separated', enum: EXPENSE_REPORT_CATEGORIES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(EXPENSE_REPORT_CATEGORIES, { each: true })
  searchCategories?: ExpenseReportCategory[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: EXPENSE_REPORT_CATEGORIES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(EXPENSE_REPORT_CATEGORIES, { each: true })
  categories?: ExpenseReportCategory[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: EXPENSE_REPORT_STATUSES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(EXPENSE_REPORT_STATUSES, { each: true })
  statuses?: ExpenseReportStatus[];

  @ApiPropertyOptional({ type: [String], description: 'One parameter per project, repeated: a project may hold a comma' })
  @IsOptional()
  @Transform(asList)
  @IsArray()
  @IsString({ each: true })
  @MaxLength(EXPENSE_REPORT_PROJECT_MAX_LENGTH, { each: true })
  projects?: string[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: EXPENSE_REPORT_PROOF_PRESENCES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(EXPENSE_REPORT_PROOF_PRESENCES, { each: true })
  proofs?: ExpenseReportProofPresence[];

  @ApiPropertyOptional({ description: 'First day of the expenses, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  from?: string;

  @ApiPropertyOptional({ description: 'Last day of the expenses, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  to?: string;

  @ApiPropertyOptional({ description: 'Lowest amount including VAT, inclusive', example: '10.00' })
  @IsOptional()
  @IsString()
  @Matches(EXPENSE_AMOUNT_PATTERN)
  minAmount?: string;

  @ApiPropertyOptional({ description: 'Highest amount including VAT, inclusive', example: '150.00' })
  @IsOptional()
  @IsString()
  @Matches(EXPENSE_AMOUNT_PATTERN)
  maxAmount?: string;

  @ApiPropertyOptional({ enum: EXPENSE_REPORT_SORTS, description: 'Column to order by, the date by default' })
  @IsOptional()
  @IsIn(EXPENSE_REPORT_SORTS)
  sort?: ExpenseReportSort;

  @ApiPropertyOptional({ enum: EXPENSE_REPORT_SORT_DIRECTIONS, description: 'Descending by default' })
  @IsOptional()
  @IsIn(EXPENSE_REPORT_SORT_DIRECTIONS)
  direction?: ExpenseReportSortDirection;
}
