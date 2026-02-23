import { describe, it, expect } from 'vitest';
import { action, type Action } from '../src/action';

describe('Action', () => {
  it('should create action with type and handler', () => {
    const testAction: Action<{ delta: number }, void> = action(
      'increment',
      (store, payload) => {
        // handler will be tested in dispatch
      }
    );

    expect(testAction.type).toBe('increment');
    expect(typeof testAction.handler).toBe('function');
  });

  it('should create action with options', () => {
    const testAction = action(
      'decrement',
      (store, payload) => {},
      { name: 'Decrement Action' }
    );

    expect(testAction.type).toBe('decrement');
    expect(testAction.name).toBe('Decrement Action');
  });

  it('should support generic payload types', () => {
    const stringAction = action<string, void>('greet', (store, name) => {});
    expect(stringAction.type).toBe('greet');

    const objectAction = action<{ x: number; y: number }, number>('add', (store, coord) => {
      return coord.x + coord.y;
    });
    expect(objectAction.type).toBe('add');
  });
});
