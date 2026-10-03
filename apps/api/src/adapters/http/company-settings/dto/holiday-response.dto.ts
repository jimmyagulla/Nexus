import { ApiProperty } from '@nestjs/swagger';

export class HolidayResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  label!: string;
}
