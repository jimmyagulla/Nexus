import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import {
  ALLOW_WITHOUT_SECOND_FACTOR,
  AllowWithoutSecondFactor,
} from './allow-without-second-factor.decorator';

class Routes {
  @AllowWithoutSecondFactor()
  open(): void {
    return undefined;
  }

  closed(): void {
    return undefined;
  }
}

describe('AllowWithoutSecondFactor', () => {
  it('marks the handler it decorates', () => {
    expect(
      new Reflector().get(ALLOW_WITHOUT_SECOND_FACTOR, Routes.prototype.open),
    ).toBe(true);
  });

  it('leaves the other handlers unmarked', () => {
    expect(
      new Reflector().get(ALLOW_WITHOUT_SECOND_FACTOR, Routes.prototype.closed),
    ).toBeUndefined();
  });
});
