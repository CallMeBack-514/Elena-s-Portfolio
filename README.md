# Elena's portfolio

A journalism portfolio site built with [Astro](https://astro.build), plus
(planned) an authenticated admin portal for Elena to manage content herself.

This project follows the Spec-Driven Development workflow documented at
`~/.claude/WORKFLOW.md`. Start here:

- `specs/mission.md` — what this is, for whom, and what's in/out of scope
- `specs/tech-stack.md` — pinned dependency versions and why
- `specs/threat-model.md` — data classification and the admin-portal threat model
- `AGENTS.md` — standing rules for anyone (human or agent) working in this repo

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command                           | Does                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                     | local dev server                                                             |
| `npm run build`                   | production build                                                             |
| `npm run preview`                 | preview the production build                                                 |
| `npm run lint`                    | ESLint                                                                       |
| `npm run format` / `format:check` | Prettier                                                                     |
| `npm run typecheck`               | `astro check`                                                                |
| `npm run test:unit`               | Vitest                                                                       |
| `npm run test:e2e`                | Playwright E2E suite                                                         |
| `npm run test:invariants`         | the durable invariant suite (`tests/invariants/`) — runs in full on every PR |
