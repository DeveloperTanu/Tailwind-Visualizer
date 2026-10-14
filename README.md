# Tailwind Visualizer
`npm install && npm run dev` → http://localhost:3000
- Canvas = iframe running the Tailwind v4 browser compiler (any utility compiles; breakpoints follow iframe width). Needs internet for the jsdelivr script.
- Class engine: `lib/tw.ts` (`setUtil/getUtil` replace one utility per group + variant prefix, leaving custom classes intact).
- State/persistence: `lib/store.ts` (reducer + validated localStorage; theme/sidebar in cookies).
