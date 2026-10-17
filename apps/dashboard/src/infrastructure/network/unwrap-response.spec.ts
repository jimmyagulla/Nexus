import { describe, expect, it } from 'vitest';
import { ApiResponse, unwrapResponse } from './unwrap-response';

describe('unwrapResponse', () => {
  it('returns the data of an enveloped response', () => {
    expect(
      unwrapResponse({ status: 200, data: { id: 'c1' } }),
    ).toEqual({ id: 'c1' });
  });

  it('returns a null payload carried by an envelope', () => {
    expect(unwrapResponse({ status: 204, data: null })).toBeNull();
  });

  it('returns a payload that is not an envelope', () => {
    expect(unwrapResponse({ id: 'c1' })).toEqual({ id: 'c1' });
  });

  it('returns a payload that has data but no status', () => {
    const payload: ApiResponse<{ data: { id: string } }> = {
      data: { id: 'c1' },
    };

    expect(unwrapResponse<{ data: { id: string } }>(payload)).toEqual({
      data: { id: 'c1' },
    });
  });

  it('returns a payload that has status but no data', () => {
    const payload: ApiResponse<{ status: number; message: string }> = {
      status: 200,
      message: 'OK',
    };

    expect(
      unwrapResponse<{ status: number; message: string }>(payload),
    ).toEqual({
      status: 200,
      message: 'OK',
    });
  });

  it('returns null when the payload is null', () => {
    expect(unwrapResponse(null)).toBeNull();
  });

  it('returns a primitive payload unchanged', () => {
    expect(unwrapResponse('Created')).toBe('Created');
  });
});
