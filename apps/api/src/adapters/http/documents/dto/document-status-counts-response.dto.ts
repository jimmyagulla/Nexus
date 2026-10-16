import { ApiProperty } from '@nestjs/swagger';

export class DocumentStatusCountsResponseDto {
  @ApiProperty()
  SEEN!: number;

  @ApiProperty()
  PENDING!: number;

  @ApiProperty()
  NEW!: number;

  @ApiProperty()
  PROCESSED!: number;
}
