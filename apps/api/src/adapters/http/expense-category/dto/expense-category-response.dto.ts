import { ApiProperty } from '@nestjs/swagger';

export class ExpenseCategoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;
}
