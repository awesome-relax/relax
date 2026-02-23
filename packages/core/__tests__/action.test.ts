import { describe, expect, it } from 'vitest';
import { type Action, action } from '../src/action';

describe('Action', () => {
  it('should create action with handler', () => {
    const testAction: Action<{ delta: number }, void> = action((store, payload) => {
      // handler will be tested in dispatch
    });

    expect(typeof testAction.handler).toBe('function');
  });

  it('should create action with options', () => {
    const testAction = action((store, payload) => {}, { name: 'Decrement Action' });

    expect(testAction.name).toBe('Decrement Action');
  });

  it('should support generic payload types', () => {
    const stringAction = action<string, void>((store, name) => {});
    expect(typeof stringAction.handler).toBe('function');

    const objectAction = action<{ x: number; y: number }, number>((store, coord) => {
      return coord.x + coord.y;
    });
    expect(typeof objectAction.handler).toBe('function');
  });
});
