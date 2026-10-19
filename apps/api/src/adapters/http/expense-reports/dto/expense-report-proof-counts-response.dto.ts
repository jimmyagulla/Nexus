import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportProofCountsResponseDto {
  @ApiProperty({ description: 'Reports carrying their receipt' })
  WITH!: number;

  @ApiProperty({ description: 'Reports without a receipt' })
  WITHOUT!: number;
}
