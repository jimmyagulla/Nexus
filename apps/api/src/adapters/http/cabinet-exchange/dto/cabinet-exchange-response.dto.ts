import { ApiProperty } from '@nestjs/swagger';
import {
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import { ExchangeDocumentResponseDto } from './exchange-document-response.dto';

export class CabinetExchangeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ExchangeDirection })
  direction!: ExchangeDirection;

  @ApiProperty({ enum: ExchangeStatus })
  status!: ExchangeStatus;

  @ApiProperty({ nullable: true, type: String })
  category!: string | null;

  @ApiProperty({ nullable: true, type: ExchangeDocumentResponseDto })
  document!: ExchangeDocumentResponseDto | null;

  @ApiProperty()
  senderId!: string;

  @ApiProperty()
  date!: string;
}
