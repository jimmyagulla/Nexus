import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CALENDAR_DATE_PATTERN } from '@hexagonal-monorepo-template/domain';

export class ExpenseRequestDto {
  @ApiProperty()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  date!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ description: 'Amount in euros' })
  @IsNumber()
  amount!: number;

  @ApiPropertyOptional({ description: 'VAT in euros', nullable: true })
  @IsOptional()
  @IsNumber()
  vat?: number | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Client, project or department' })
  @IsString()
  @IsNotEmpty()
  assignment!: string;
}
