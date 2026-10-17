import { ApiProperty } from '@nestjs/swagger';

export class DocumentCategoryCountsResponseDto {
  @ApiProperty()
  SICK_LEAVE!: number;

  @ApiProperty()
  OTHER!: number;

  @ApiProperty()
  ADMINISTRATIVE!: number;

  @ApiProperty()
  PROOF!: number;
}
