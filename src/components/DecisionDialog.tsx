import { useEffect, useRef } from 'react';
import type { Option } from '../lib/options';

interface Props {
  result: Option | null;
  canRetry: boolean;
  onClose: () => void;
  onRetry: () => void;
  onRemove: (id: string) => void;
}

export function DecisionDialog({ result, canRetry, onClose, onRetry, onRemove }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (result && !dialog.open) dialog.showModal();
    if (!result && dialog.open) dialog.close();
  }, [result]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="decision-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {result && (
        <div className="dialog__body">
          <p className="dialog__eyebrow" id="decision-title">
            You should…
          </p>
          <p className="dialog__result">{result.text}</p>
          <div className="dialog__actions">
            <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>
              Let’s do it
            </button>
            {canRetry && (
              <button type="button" className="btn btn--ghost" onClick={onRetry}>
                Pick again
              </button>
            )}
            <button
              type="button"
              className="btn btn--ghost btn--danger"
              onClick={() => {
                onRemove(result.id);
                onClose();
              }}
            >
              Remove it
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
