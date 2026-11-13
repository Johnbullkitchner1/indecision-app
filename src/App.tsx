import { useEffect, useState } from 'react';
import { AddOptionForm } from './components/AddOptionForm';
import { DecisionDialog } from './components/DecisionDialog';
import { OptionList } from './components/OptionList';
import { useOptions } from './hooks/useOptions';
import { usePicker } from './hooks/usePicker';

export default function App() {
  const [options, dispatch] = useOptions();
  const { pick, dismiss, picking, result, highlightedId } = usePicker(options);
  const [confirmClear, setConfirmClear] = useState(false);

  // Reset the two-step "clear all" confirmation after a few seconds.
  useEffect(() => {
    if (!confirmClear) return;
    const t = window.setTimeout(() => setConfirmClear(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirmClear]);

  const count = options.length;

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">Indecision</h1>
        <p className="hero__subtitle">Put your life in the hands of a computer.</p>
      </header>

      <main className="card">
        <button
          type="button"
          className="btn btn--primary btn--block btn--lg"
          disabled={count < 2 || picking}
          onClick={pick}
        >
          {picking ? 'Deciding…' : 'What should I do?'}
        </button>
        {count === 1 && <p className="hint">Add at least one more option to decide between.</p>}

        <div className="card__header">
          <h2 className="card__title">
            Your options <span className="badge">{count}</span>
          </h2>
          {count > 0 && (
            <button
              type="button"
              className={`btn btn--ghost btn--sm${confirmClear ? ' btn--danger' : ''}`}
              disabled={picking}
              onClick={() => {
                if (confirmClear) {
                  dispatch({ type: 'clear' });
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                }
              }}
            >
              {confirmClear ? 'Click again to clear' : 'Clear all'}
            </button>
          )}
        </div>

        <OptionList
          options={options}
          highlightedId={highlightedId}
          disabled={picking}
          onRemove={(id) => dispatch({ type: 'remove', id })}
        />

        <AddOptionForm
          options={options}
          disabled={picking}
          onAdd={(text) => dispatch({ type: 'add', text })}
        />
      </main>

      <footer className="footer">Your options are saved in this browser.</footer>

      <DecisionDialog
        result={result}
        canRetry={count > 1}
        onClose={dismiss}
        onRetry={pick}
        onRemove={(id) => dispatch({ type: 'remove', id })}
      />
    </div>
  );
}
