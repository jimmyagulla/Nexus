import { ApiProperty } from '@nestjs/swagger';

export class CabinetIndicatorsResponseDto {
  @ApiProperty({ description: 'Indicator cabinet.a-transmettre' })
  toTransmit!: number;

  @ApiProperty({ description: 'Indicator cabinet.recus' })
  received!: number;

  @ApiProperty({ description: 'Indicator cabinet.non-consultes' })
  notConsulted!: number;
}
