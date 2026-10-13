import { ApiProperty } from '@nestjs/swagger';

export class PresenceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  employeeName!: string;

  @ApiProperty()
  month!: string;

  @ApiProperty()
  workedDays!: number;
}
