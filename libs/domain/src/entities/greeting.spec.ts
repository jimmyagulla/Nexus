import { Greeting } from './greeting';

describe('Greeting', () => {
  it('exposes its message', () => {
    const greeting = new Greeting('Hello API');

    expect(greeting.message).toBe('Hello API');
  });
});
