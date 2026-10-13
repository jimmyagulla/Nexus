import { ApiProperty } from '@nestjs/swagger';

export class ExpenseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ nullable: true, type: Number })
  vat!: number | null;

  @ApiProperty()
  paymentMethod!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  assignment!: string;
}
