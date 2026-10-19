import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportRefundedStatsResponseDto {
  @ApiProperty({ description: 'The current year' })
  year!: number;

  @ApiProperty({ example: '1284.60' })
  amount!: string;
}
