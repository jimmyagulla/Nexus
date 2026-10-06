import { ApiProperty } from '@nestjs/swagger';

export class PublicHolidayResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  label!: string;
}
