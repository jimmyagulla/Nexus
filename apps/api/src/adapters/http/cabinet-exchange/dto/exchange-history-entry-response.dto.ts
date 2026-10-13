import { ApiProperty } from '@nestjs/swagger';
import {
  ExchangeDirection,
  ExchangeEventKind,
  UserRole,
} from '@hexagonal-monorepo-template/domain';

export class ExchangeHistoryEntryResponseDto {
  @ApiProperty()
  exchangeId!: string;

  @ApiProperty({ enum: ExchangeEventKind })
  kind!: ExchangeEventKind;

  @ApiProperty({ enum: UserRole, nullable: true })
  actorRole!: UserRole | null;

  @ApiProperty()
  occurredAt!: string;

  @ApiProperty()
  documentCount!: number;

  @ApiProperty({ enum: ExchangeDirection })
  direction!: ExchangeDirection;

  @ApiProperty({ nullable: true, type: String })
  fileName!: string | null;
}
