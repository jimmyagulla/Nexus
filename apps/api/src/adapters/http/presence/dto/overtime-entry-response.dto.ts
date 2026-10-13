import { ApiProperty } from '@nestjs/swagger';

export class OvertimeEntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '2026-10-12' })
  date!: string;

  @ApiProperty()
  hours!: number;
}
