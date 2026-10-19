import { ApiProperty } from '@nestjs/swagger';

export class PersonalContactResponseDto {
  @ApiProperty({ example: '14 rue des Tilleuls' })
  address!: string;

  @ApiProperty({ example: '34000 Montpellier' })
  postalCodeAndCity!: string;

  @ApiProperty({ example: '06 12 34 56 47' })
  phone!: string;

  @ApiProperty({ description: 'Personal e-mail address', example: 'camille.martin@mail.fr' })
  email!: string;
}
