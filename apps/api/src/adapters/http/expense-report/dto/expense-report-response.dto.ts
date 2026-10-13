import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportStatus } from '@hexagonal-monorepo-template/domain';
import { ExpenseResponseDto } from './expense-response.dto';

export class ExpenseReportResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty({ enum: ExpenseReportStatus })
  status!: ExpenseReportStatus;

  @ApiProperty({ description: 'Sum of the expense amounts, in euros' })
  total!: number;

  @ApiProperty({ type: [ExpenseResponseDto] })
  expenses!: ExpenseResponseDto[];
}
