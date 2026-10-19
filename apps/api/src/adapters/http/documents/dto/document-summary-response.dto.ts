import { ApiProperty } from '@nestjs/swagger';
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_EMITTERS,
  DOCUMENT_STATUSES,
  DocumentCategory,
  DocumentEmitter,
  DocumentFileFormat,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';

export class DocumentSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: DOCUMENT_CATEGORIES })
  category!: DocumentCategory;

  @ApiProperty({ enum: DOCUMENT_STATUSES })
  status!: DocumentStatus;

  @ApiProperty({ enum: DocumentFileFormat })
  format!: DocumentFileFormat;

  @ApiProperty()
  sizeBytes!: number;

  @ApiProperty({ enum: DOCUMENT_EMITTERS })
  emitter!: DocumentEmitter;

  @ApiProperty({ type: String, nullable: true })
  comment!: string | null;

  @ApiProperty({ description: 'ISO 8601 instant' })
  createdAt!: string;
}
