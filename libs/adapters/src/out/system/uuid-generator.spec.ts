import { describe, expect, it } from 'vitest';
import { UuidGenerator } from './uuid-generator';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('UuidGenerator', () => {
  it('generates a version 4 uuid', () => {
    expect(new UuidGenerator().generate()).toMatch(UUID_V4);
  });

  it('generates a different value every time', () => {
    const generator = new UuidGenerator();

    expect(generator.generate()).not.toBe(generator.generate());
  });
});
