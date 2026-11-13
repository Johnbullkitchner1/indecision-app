import type { Option } from '../lib/options';

interface Props {
  options: readonly Option[];
  highlightedId: string | null;
  disabled?: boolean;
  onRemove: (id: string) => void;
}

export function OptionList({ options, highlightedId, disabled, onRemove }: Props) {
  if (options.length === 0) {
    return (
      <div className="empty">
        <p className="empty__title">No options yet</p>
        <p className="empty__hint">Add two or more things you can’t decide between.</p>
      </div>
    );
  }

  return (
    <ol className="option-list">
      {options.map((option, i) => (
        <li
          key={option.id}
          className={`option${option.id === highlightedId ? ' option--active' : ''}`}
        >
          <span className="option__index" aria-hidden="true">
            {i + 1}
          </span>
          <span className="option__text">{option.text}</span>
          <button
            type="button"
            className="icon-btn"
            disabled={disabled}
            onClick={() => onRemove(option.id)}
            aria-label={`Remove “${option.text}”`}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </li>
      ))}
    </ol>
  );
}
