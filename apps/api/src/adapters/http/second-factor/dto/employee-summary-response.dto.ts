import { ApiProperty } from '@nestjs/swagger';

export class EmployeeSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;
}
