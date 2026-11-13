# Indecision

Can't decide? Add your options and let the computer pick one for you.

Built with React, TypeScript and Vite.

## Features

- Add, remove and clear options (with a two-step confirm for "Clear all")
- Input validation: no blanks, no case-insensitive duplicates, length and count limits
- Animated "spin" that lands on the chosen option, then a result dialog with
  **Pick again** (never repeats the previous pick) and **Remove it**
- Options persist in `localStorage` and sync across open tabs
- Keyboard and screen-reader friendly (native `<dialog>`, labelled controls, live error messages)
- Light/dark theme follows the system; respects `prefers-reduced-motion`

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm test          # run unit tests
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Project structure

```
src/
  lib/options.ts         # pure domain logic: reducer, validation, random pick, storage parsing
  lib/options.test.ts    # unit tests
  hooks/useOptions.ts    # persisted options state
  hooks/usePicker.ts     # random pick + spin animation
  components/            # AddOptionForm, OptionList, DecisionDialog
  App.tsx
  styles.css
```
