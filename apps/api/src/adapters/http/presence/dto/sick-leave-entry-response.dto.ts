import { ApiProperty } from '@nestjs/swagger';

export class SickLeaveEntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '2026-10-14' })
  date!: string;
}
