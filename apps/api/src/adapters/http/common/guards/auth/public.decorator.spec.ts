import { describe, expect, it } from 'vitest';
import { IS_PUBLIC, Public } from './public.decorator';

class Sample {
  @Public()
  open(): void {
    return;
  }
}

describe('Public', () => {
  it('marks the handler as public', () => {
    expect(Reflect.getMetadata(IS_PUBLIC, Sample.prototype.open)).toBe(true);
  });
});
