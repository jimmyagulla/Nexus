import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class AdjustWorkedDaysRequestDto {
  @ApiProperty({ minimum: 0, maximum: 31 })
  @IsInt()
  @Min(0)
  @Max(31)
  workedDays!: number;
}
