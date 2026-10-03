import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Max, Min } from 'class-validator';

export class UpdateNonWorkingWeekdaysRequestDto {
  @ApiProperty({ example: [5, 6], description: 'Weekday numbers (0 = Sunday)' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays!: number[];
}
