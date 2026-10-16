import { ApiProperty } from '@nestjs/swagger';
import { DocumentCategoryCountsResponseDto } from './document-category-counts-response.dto';
import { DocumentStatusCountsResponseDto } from './document-status-counts-response.dto';
import { DocumentSummaryResponseDto } from './document-summary-response.dto';

export class DocumentListResponseDto {
  @ApiProperty({ type: [DocumentSummaryResponseDto] })
  items!: DocumentSummaryResponseDto[];

  @ApiProperty({ description: 'Every document of the owner, whatever the criteria' })
  total!: number;

  @ApiProperty({ type: DocumentCategoryCountsResponseDto })
  categoryCounts!: DocumentCategoryCountsResponseDto;

  @ApiProperty({ type: DocumentStatusCountsResponseDto })
  statusCounts!: DocumentStatusCountsResponseDto;
}
