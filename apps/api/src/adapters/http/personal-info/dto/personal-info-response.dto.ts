import { ApiProperty } from '@nestjs/swagger';
import { EmploymentRecordResponseDto } from './employment-record-response.dto';
import { PersonalContactResponseDto } from './personal-contact-response.dto';

export class PersonalInfoResponseDto {
  @ApiProperty()
  employeeId!: string;

  @ApiProperty({ type: PersonalContactResponseDto })
  contact!: PersonalContactResponseDto;

  @ApiProperty({ type: EmploymentRecordResponseDto })
  employment!: EmploymentRecordResponseDto;

  @ApiProperty({ description: 'ISO 8601 instant of the last change' })
  updatedAt!: string;
}
