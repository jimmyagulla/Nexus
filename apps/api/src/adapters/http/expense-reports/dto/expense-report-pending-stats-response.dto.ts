import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportPendingStatsResponseDto {
  @ApiProperty({ description: 'Reports submitted or being processed' })
  count!: number;

  @ApiProperty({ example: '154.50' })
  amount!: string;
}
