import { ApiProperty } from '@nestjs/swagger';

export class EmployeeReferenceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;
}
