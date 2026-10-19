import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
  DOCUMENT_NAME_MAX_LENGTH,
  DocumentCategory,
} from '@hexagonal-monorepo-template/domain';

/** A form field sent once arrives as a string, sent several times as a list. */
const asList = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? [value] : value;

/** Text fields of a deposit. The files travel in the `files` parts. */
export class DepositDocumentsRequestDto {
  @ApiProperty({ enum: DOCUMENT_CATEGORIES })
  @IsIn(DOCUMENT_CATEGORIES)
  category!: DocumentCategory;

  @ApiPropertyOptional({ maxLength: DOCUMENT_COMMENT_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(DOCUMENT_COMMENT_MAX_LENGTH)
  comment?: string;

  @ApiProperty({
    type: [String],
    description: 'One name per file, in the order of the files',
    maxLength: DOCUMENT_NAME_MAX_LENGTH,
  })
  @Transform(asList)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(DOCUMENT_MAX_FILES_PER_DEPOSIT)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(DOCUMENT_NAME_MAX_LENGTH, { each: true })
  names!: string[];
}
