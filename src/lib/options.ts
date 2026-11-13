export interface Option {
  id: string;
  text: string;
}

export const MAX_OPTION_LENGTH = 120;
export const MAX_OPTIONS = 50;

export type OptionsAction =
  | { type: 'add'; text: string }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'replace'; options: Option[] };

/** Normalise user input: trim and collapse internal whitespace. */
export function normalize(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Validate a candidate option against the current list.
 * Returns an error message, or null if the option is acceptable.
 */
export function validateOption(text: string, options: readonly Option[]): string | null {
  const value = normalize(text);
  if (!value) return 'Enter something to add.';
  if (value.length > MAX_OPTION_LENGTH) return `Keep it under ${MAX_OPTION_LENGTH} characters.`;
  if (options.length >= MAX_OPTIONS) return `You can have at most ${MAX_OPTIONS} options.`;
  const lower = value.toLocaleLowerCase();
  if (options.some((o) => o.text.toLocaleLowerCase() === lower)) {
    return 'That option is already on the list.';
  }
  return null;
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function optionsReducer(state: Option[], action: OptionsAction): Option[] {
  switch (action.type) {
    case 'add': {
      if (validateOption(action.text, state)) return state;
      return [...state, { id: createId(), text: normalize(action.text) }];
    }
    case 'remove':
      return state.filter((o) => o.id !== action.id);
    case 'clear':
      return state.length ? [] : state;
    case 'replace':
      return action.options;
  }
}

/** Pick a random index, avoiding `previous` when there is more than one choice. */
export function pickIndex(length: number, previous: number | null = null, rand: () => number = Math.random): number {
  if (length <= 0) throw new RangeError('Cannot pick from an empty list');
  if (length === 1 || previous === null || previous >= length) {
    return Math.floor(rand() * length);
  }
  const i = Math.floor(rand() * (length - 1));
  return i >= previous ? i + 1 : i;
}

/** Parse persisted options defensively; anything malformed is discarded. */
export function parseStoredOptions(raw: string | null): Option[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const result: Option[] = [];
    for (const item of data) {
      if (
        item && typeof item === 'object' &&
        typeof (item as Option).id === 'string' &&
        typeof (item as Option).text === 'string' &&
        !validateOption((item as Option).text, result)
      ) {
        result.push({ id: (item as Option).id, text: normalize((item as Option).text) });
      }
    }
    return result;
  } catch {
    return [];
  }
}
