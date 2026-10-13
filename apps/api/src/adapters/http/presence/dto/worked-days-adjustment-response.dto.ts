import { ApiProperty } from '@nestjs/swagger';

export class WorkedDaysAdjustmentResponseDto {
  @ApiProperty()
  actorId!: string;

  @ApiProperty({ example: '2026-10-13T09:00:00.000Z' })
  occurredAt!: string;

  @ApiProperty()
  before!: number;

  @ApiProperty()
  after!: number;
}
