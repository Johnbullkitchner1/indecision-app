import { describe, expect, it } from 'vitest';
import {
  MAX_OPTION_LENGTH,
  normalize,
  optionsReducer,
  parseStoredOptions,
  pickIndex,
  validateOption,
  type Option,
} from './options';

const opts = (...texts: string[]): Option[] => texts.map((text, i) => ({ id: String(i), text }));

describe('normalize', () => {
  it('trims and collapses whitespace', () => {
    expect(normalize('  go   to \n the gym ')).toBe('go to the gym');
  });
});

describe('validateOption', () => {
  it('rejects empty input', () => {
    expect(validateOption('   ', [])).toMatch(/enter something/i);
  });
  it('rejects case-insensitive duplicates', () => {
    expect(validateOption('  PIZZA ', opts('pizza'))).toMatch(/already/i);
  });
  it('rejects overly long input', () => {
    expect(validateOption('x'.repeat(MAX_OPTION_LENGTH + 1), [])).toMatch(/under/i);
  });
  it('accepts a valid option', () => {
    expect(validateOption('Tacos', opts('Pizza'))).toBeNull();
  });
});

describe('optionsReducer', () => {
  it('adds a normalized option', () => {
    const next = optionsReducer([], { type: 'add', text: '  Read  a book ' });
    expect(next).toHaveLength(1);
    expect(next[0].text).toBe('Read a book');
  });
  it('ignores invalid adds and returns the same state', () => {
    const state = opts('a');
    expect(optionsReducer(state, { type: 'add', text: 'A' })).toBe(state);
  });
  it('removes by id', () => {
    expect(optionsReducer(opts('a', 'b'), { type: 'remove', id: '0' })).toEqual([{ id: '1', text: 'b' }]);
  });
  it('clears', () => {
    expect(optionsReducer(opts('a', 'b'), { type: 'clear' })).toEqual([]);
  });
});

describe('pickIndex', () => {
  it('throws on an empty list', () => {
    expect(() => pickIndex(0)).toThrow(RangeError);
  });
  it('never repeats the previous pick when it has a choice', () => {
    for (let r = 0; r < 1; r += 0.05) {
      expect(pickIndex(3, 1, () => r)).not.toBe(1);
    }
  });
  it('stays in range', () => {
    for (let r = 0; r < 1; r += 0.05) {
      const i = pickIndex(4, 3, () => r);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(4);
    }
  });
});

describe('parseStoredOptions', () => {
  it('handles missing or corrupt data', () => {
    expect(parseStoredOptions(null)).toEqual([]);
    expect(parseStoredOptions('{not json')).toEqual([]);
    expect(parseStoredOptions('{"a":1}')).toEqual([]);
  });
  it('drops malformed and duplicate entries', () => {
    const raw = JSON.stringify([{ id: '1', text: 'Pizza' }, { id: '2', text: 'pizza' }, { id: 3 }, 'x']);
    expect(parseStoredOptions(raw)).toEqual([{ id: '1', text: 'Pizza' }]);
  });
});
