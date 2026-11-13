import { useCallback, useEffect, useRef, useState } from 'react';
import { pickIndex, type Option } from '../lib/options';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Picks a random option with a short "spinning" highlight animation that
 * decelerates and lands on the winner. Skipped when the user prefers reduced motion.
 */
export function usePicker(options: readonly Option[]) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [result, setResult] = useState<Option | null>(null);
  const [picking, setPicking] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const lastIndex = useRef<number | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = useCallback(() => {
    if (options.length === 0) return;
    window.clearTimeout(timer.current);
    setResult(null);

    const winner = pickIndex(options.length, lastIndex.current);
    lastIndex.current = winner;

    if (options.length === 1 || prefersReducedMotion()) {
      setHighlightedId(options[winner].id);
      setResult(options[winner]);
      return;
    }

    // Spin through at least two full laps, landing exactly on the winner.
    const steps = options.length * 2 + winner + 1;
    let step = 0;
    setPicking(true);

    const tick = () => {
      const index = step % options.length;
      setHighlightedId(options[index].id);
      step += 1;
      if (step >= steps) {
        timer.current = window.setTimeout(() => {
          setPicking(false);
          setResult(options[winner]);
        }, 350);
        return;
      }
      // Ease out: delays grow from ~40ms to ~260ms.
      const progress = step / steps;
      timer.current = window.setTimeout(tick, 40 + 220 * progress ** 3);
    };
    tick();
  }, [options]);

  const dismiss = useCallback(() => {
    setResult(null);
    setHighlightedId(null);
  }, []);

  return { pick, dismiss, picking, result, highlightedId };
}
