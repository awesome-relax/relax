import { describe, expect, it, vi } from 'vitest';
import { createEvent } from '../src/event';

describe('event', () => {
  it('should add, call and remove listeners', () => {
    const onMessage = createEvent<string>();
    const spy = vi.fn();
    const spy2 = vi.fn();
    onMessage.on(spy);
    onMessage.on(spy2);

    onMessage('hi');
    expect(spy).toHaveBeenCalledWith('hi');
    expect(spy2).toHaveBeenCalledWith('hi');

    onMessage.off(spy);
    onMessage('hello');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);
  });
});
