import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsIn } from 'class-validator';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';

const DAYS = Object.values(DayOfWeek);

export class UpdateNonWorkingWeekdaysRequestDto {
  @ApiProperty({ enum: DAYS, isArray: true })
  @IsArray()
  @ArrayUnique()
  @IsIn(DAYS, { each: true })
  weekdays!: DayOfWeek[];
}
