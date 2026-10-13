import { ApiProperty } from '@nestjs/swagger';

export class AbsenceEntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty({ example: '2026-10-05' })
  start!: string;

  @ApiProperty({ example: '2026-10-07' })
  end!: string;

  @ApiProperty()
  days!: number;
}
