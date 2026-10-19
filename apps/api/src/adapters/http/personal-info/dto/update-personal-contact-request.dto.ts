import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import {
  PERSONAL_ADDRESS_MAX_LENGTH,
  PERSONAL_EMAIL_MAX_LENGTH,
  PERSONAL_EMAIL_PATTERN,
  PERSONAL_PHONE_PATTERN,
  PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH,
  PERSONAL_POSTAL_CODE_AND_CITY_PATTERN,
} from '@hexagonal-monorepo-template/domain';

/** The four contact details the employee changes; nothing else is accepted. */
export class UpdatePersonalContactRequestDto {
  @ApiProperty({ example: '14 rue des Tilleuls', maxLength: PERSONAL_ADDRESS_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(PERSONAL_ADDRESS_MAX_LENGTH)
  address!: string;

  @ApiProperty({ example: '34000 Montpellier', maxLength: PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH })
  @IsString()
  @MaxLength(PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH)
  @Matches(PERSONAL_POSTAL_CODE_AND_CITY_PATTERN)
  postalCodeAndCity!: string;

  @ApiProperty({ example: '06 12 34 56 47' })
  @IsString()
  @Matches(PERSONAL_PHONE_PATTERN)
  phone!: string;

  @ApiProperty({ example: 'camille.martin@mail.fr', maxLength: PERSONAL_EMAIL_MAX_LENGTH })
  @IsString()
  @MaxLength(PERSONAL_EMAIL_MAX_LENGTH)
  @Matches(PERSONAL_EMAIL_PATTERN)
  email!: string;
}
