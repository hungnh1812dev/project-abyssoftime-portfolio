# Commands & Dev Setup

```bash
bun run dev      # Dev server → http://localhost:4000
bun run analize  # Build with bundle analyzer
bun run build    # Production build
bun start        # Production server → http://localhost:5005
bun run lint     # ESLint (flat config)
```

## Next.js Config

File: `next.config.mjs`

- Bundle analyzer: enabled via env `ANALYZE=true npm run build`
- React Compiler: enabled (babel-plugin-react-compiler)
- Image formats: AVIF, WebP
- Fetch logging: URL, HMR refresh log enabled
- `poweredByHeader: false`, `compress: true`

## ESLint

Config: `eslint.config.mjs` (flat config — ESLint v9)

Do not use `.eslintrc.*` — already migrated to flat config.

## TypeScript

Config: `tsconfig.json`

Path aliases (all relative from `src/`):

```json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/views/*": ["./src/views/*"],
  "@/libs/*": ["./src/lib/*"],
  "@/styles/*": ["./src/assets/styles/*"],
  "@/images/*": ["./src/assets/images/*"]
}
```

## Prettier Hook

PostToolUse hook auto-runs prettier after each Edit/Write to a file. No need to run it manually.
