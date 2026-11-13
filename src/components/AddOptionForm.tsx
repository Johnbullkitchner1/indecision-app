import { useId, useRef, useState, type FormEvent } from 'react';
import { MAX_OPTION_LENGTH, validateOption, type Option } from '../lib/options';

interface Props {
  options: readonly Option[];
  disabled?: boolean;
  onAdd: (text: string) => void;
}

export function AddOptionForm({ options, disabled, onAdd }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const problem = validateOption(value, options);
    if (problem) {
      setError(problem);
      inputRef.current?.focus();
      return;
    }
    onAdd(value);
    setValue('');
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-option" className="visually-hidden">
        New option
      </label>
      <div className="add-form__row">
        <input
          ref={inputRef}
          id="new-option"
          className="input"
          type="text"
          autoComplete="off"
          placeholder="Add an option, e.g. “Order pizza”"
          maxLength={MAX_OPTION_LENGTH + 20}
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="btn btn--secondary" disabled={disabled}>
          Add
        </button>
      </div>
      <p id={errorId} className="add-form__error" role="alert">
        {error}
      </p>
    </form>
  );
}
