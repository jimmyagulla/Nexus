import { parseBool, parsePort, parsePersistence, readOptional } from './parse-env';

describe('parsePort', () => {
  it('parses a numeric port string', () => {
    expect(parsePort('8080', 3000)).toBe(8080);
  });

  it('returns the fallback when the value is missing', () => {
    expect(parsePort(undefined, 3000)).toBe(3000);
  });

  it('returns the fallback when the value is empty', () => {
    expect(parsePort('', 3000)).toBe(3000);
  });

  it('parses the lowest and the highest reachable port', () => {
    expect(parsePort('1', 3000)).toBe(1);
    expect(parsePort('65535', 3000)).toBe(65535);
  });

  it('throws when the value is not an integer', () => {
    expect(() => parsePort('abc', 3000)).toThrow('Invalid port: abc');
  });

  it('throws when the port is a decimal number', () => {
    expect(() => parsePort('3000.5', 3000)).toThrow('Invalid port: 3000.5');
  });

  it('throws when the port is negative', () => {
    expect(() => parsePort('-1', 3000)).toThrow('Invalid port: -1');
  });

  it('throws when the port is below 1', () => {
    expect(() => parsePort('0', 3000)).toThrow('Invalid port: 0');
  });

  it('throws when the port is above 65535', () => {
    expect(() => parsePort('70000', 3000)).toThrow('Invalid port: 70000');
  });
});

describe('parseBool', () => {
  it('parses true', () => {
    expect(parseBool('true', false)).toBe(true);
  });

  it('parses FALSE case-insensitively', () => {
    expect(parseBool('FALSE', true)).toBe(false);
  });

  it('parses 1 as true', () => {
    expect(parseBool('1', false)).toBe(true);
  });

  it('parses 0 as false', () => {
    expect(parseBool('0', true)).toBe(false);
  });

  it('returns the fallback when the value is missing', () => {
    expect(parseBool(undefined, true)).toBe(true);
  });

  it('returns the fallback when the value is empty', () => {
    expect(parseBool('', true)).toBe(true);
  });

  it('throws when the value is not a boolean', () => {
    expect(() => parseBool('yes', true)).toThrow('Invalid boolean: yes');
  });
});

describe('readOptional', () => {
  it('returns a trimmed string', () => {
    expect(readOptional('  api  ')).toBe('api');
  });

  it('returns undefined when the value is missing', () => {
    expect(readOptional(undefined)).toBeUndefined();
  });

  it('returns undefined when the value is blank', () => {
    expect(readOptional('   ')).toBeUndefined();
  });
});

describe('parsePersistence', () => {
  it('returns the fallback when missing', () => {
    expect(parsePersistence(undefined, 'memory')).toBe('memory');
  });

  it('returns the fallback when the value is empty', () => {
    expect(parsePersistence('', 'postgres')).toBe('postgres');
  });

  it('parses postgres', () => {
    expect(parsePersistence('postgres', 'memory')).toBe('postgres');
  });

  it('parses memory', () => {
    expect(parsePersistence('memory', 'postgres')).toBe('memory');
  });

  it('throws when the value is unknown', () => {
    expect(() => parsePersistence('sqlite', 'memory')).toThrow(
      'Invalid persistence: sqlite',
    );
  });
});

