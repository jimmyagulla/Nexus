import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  CALENDAR_DATE_PATTERN,
  DOCUMENT_CATEGORIES,
  DOCUMENT_EMITTERS,
  DOCUMENT_SEARCH_MAX_LENGTH,
  DOCUMENT_SORT_DIRECTIONS,
  DOCUMENT_SORTS,
  DOCUMENT_STATUSES,
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentSortDirection,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';

/** `a,b` in the query string → `['a', 'b']`. */
const commaSeparated = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter((item) => item !== '')
    : value;

export class ListDocumentsQueryDto {
  @ApiPropertyOptional({ maxLength: DOCUMENT_SEARCH_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(DOCUMENT_SEARCH_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: 'Categories whose label matches the search, comma-separated', enum: DOCUMENT_CATEGORIES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(DOCUMENT_CATEGORIES, { each: true })
  searchCategories?: DocumentCategory[];

  @ApiPropertyOptional({ description: 'Emitters whose label matches the search, comma-separated', enum: DOCUMENT_EMITTERS })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(DOCUMENT_EMITTERS, { each: true })
  searchEmitters?: DocumentEmitter[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: DOCUMENT_CATEGORIES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(DOCUMENT_CATEGORIES, { each: true })
  categories?: DocumentCategory[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: DOCUMENT_STATUSES })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(DOCUMENT_STATUSES, { each: true })
  statuses?: DocumentStatus[];

  @ApiPropertyOptional({ description: 'Comma-separated', enum: DOCUMENT_EMITTERS })
  @IsOptional()
  @Transform(commaSeparated)
  @IsArray()
  @IsIn(DOCUMENT_EMITTERS, { each: true })
  emitters?: DocumentEmitter[];

  @ApiPropertyOptional({ description: 'First day, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  from?: string;

  @ApiPropertyOptional({ description: 'Last day, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(CALENDAR_DATE_PATTERN)
  to?: string;

  @ApiPropertyOptional({ enum: DOCUMENT_SORTS, description: 'Column to order by, the date by default' })
  @IsOptional()
  @IsIn(DOCUMENT_SORTS)
  sort?: DocumentSort;

  @ApiPropertyOptional({ enum: DOCUMENT_SORT_DIRECTIONS, description: 'Descending by default' })
  @IsOptional()
  @IsIn(DOCUMENT_SORT_DIRECTIONS)
  direction?: DocumentSortDirection;
}
