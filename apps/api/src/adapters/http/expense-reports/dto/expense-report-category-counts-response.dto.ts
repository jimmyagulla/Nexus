import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportCategoryCountsResponseDto {
  @ApiProperty()
  OTHER!: number;

  @ApiProperty()
  FUEL!: number;

  @ApiProperty()
  TRAVEL!: number;

  @ApiProperty()
  HOTEL!: number;

  @ApiProperty()
  PARKING!: number;

  @ApiProperty()
  MEAL!: number;
}
