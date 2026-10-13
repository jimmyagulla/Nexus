import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import {
  CALENDAR_DATE_PATTERN,
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';

export class ListCabinetExchangesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'First day, YYYY-MM-DD' })
  @IsOptional()
  @Matches(CALENDAR_DATE_PATTERN)
  from?: string;

  @ApiPropertyOptional({ description: 'Last day, YYYY-MM-DD' })
  @IsOptional()
  @Matches(CALENDAR_DATE_PATTERN)
  to?: string;

  @ApiPropertyOptional({ enum: ExchangeDirection })
  @IsOptional()
  @IsEnum(ExchangeDirection)
  direction?: ExchangeDirection;

  @ApiPropertyOptional({ enum: ExchangeStatus })
  @IsOptional()
  @IsEnum(ExchangeStatus)
  status?: ExchangeStatus;
}
