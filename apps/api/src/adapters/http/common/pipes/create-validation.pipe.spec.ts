import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { createValidationPipe } from './create-validation.pipe';

class NameDto {
  @IsString()
  name!: string;
}

class CountDto {
  @Type(() => Number)
  @IsInt()
  count!: number;
}

describe('createValidationPipe', () => {
  it('returns a ValidationPipe instance', () => {
    const pipe = createValidationPipe();

    expect(pipe).toBeInstanceOf(ValidationPipe);
  });

  it('can decorate a DTO with class-validator and class-transformer', () => {
    expect(NameDto).toBeDefined();
    expect(Type).toBeTypeOf('function');
  });

  it('transforms plain objects into DTO instances with coerced types', async () => {
    const pipe = createValidationPipe();
    const result = await pipe.transform(
      { count: '42' },
      { type: 'body', metatype: CountDto },
    );

    expect(result).toBeInstanceOf(CountDto);
    expect(result.count).toBe(42);
  });

  it('rejects payloads with non-whitelisted properties', async () => {
    const pipe = createValidationPipe();

    await expect(
      pipe.transform(
        { name: 'ok', hacker: 'x' },
        { type: 'body', metatype: NameDto },
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
