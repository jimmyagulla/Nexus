import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportProjectCountResponseDto {
  @ApiProperty()
  project!: string;

  @ApiProperty()
  count!: number;
}
