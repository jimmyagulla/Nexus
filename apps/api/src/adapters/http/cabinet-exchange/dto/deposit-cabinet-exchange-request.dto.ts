import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ExchangeFileRequestDto } from './exchange-file-request.dto';

export class DepositCabinetExchangeRequestDto {
  @ApiProperty()
  @IsString()
  category!: string;

  @ApiPropertyOptional({ type: ExchangeFileRequestDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExchangeFileRequestDto)
  file?: ExchangeFileRequestDto | null;
}
