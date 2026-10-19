import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportStatusCountsResponseDto {
  @ApiProperty()
  IN_PROGRESS!: number;

  @ApiProperty()
  REJECTED!: number;

  @ApiProperty()
  REFUNDED!: number;

  @ApiProperty()
  SUBMITTED!: number;
}
