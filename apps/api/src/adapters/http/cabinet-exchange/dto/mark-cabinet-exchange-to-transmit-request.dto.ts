import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ExchangeFileRequestDto } from './exchange-file-request.dto';

export class MarkCabinetExchangeToTransmitRequestDto {
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  category?: string | null;

  @ApiPropertyOptional({ type: ExchangeFileRequestDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExchangeFileRequestDto)
  file?: ExchangeFileRequestDto | null;
}
