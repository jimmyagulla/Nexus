import { ApiProperty } from '@nestjs/swagger';
import {
  EmploymentContractType,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';

/** What the employer records; read only. */
export class EmploymentRecordResponseDto {
  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty({ example: '1992-05-18' })
  birthDate!: string;

  @ApiProperty({ description: 'Masked', example: '2 92 05 •• ••• ••• 41' })
  socialSecurityNumber!: string;

  @ApiProperty()
  jobTitle!: string;

  @ApiProperty()
  department!: string;

  @ApiProperty({ enum: EmploymentContractType })
  contractType!: EmploymentContractType;

  @ApiProperty({ enum: WorkingTime })
  workingTime!: WorkingTime;

  @ApiProperty({ example: '2021-03-02' })
  startDate!: string;

  @ApiProperty({ description: 'Masked', example: 'FR76 •••• •••• •••• •••• •••• 189' })
  iban!: string;
}
