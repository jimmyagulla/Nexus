import { ApiProperty } from '@nestjs/swagger';
import { EmployeeReferenceResponseDto } from './employee-reference-response.dto';
import { PresenceResponseDto } from './presence-response.dto';

export class PresenceListResponseDto {
  @ApiProperty({ type: [PresenceResponseDto] })
  presences!: PresenceResponseDto[];

  @ApiProperty({ type: [EmployeeReferenceResponseDto] })
  employees!: EmployeeReferenceResponseDto[];

  @ApiProperty()
  canManage!: boolean;
}
