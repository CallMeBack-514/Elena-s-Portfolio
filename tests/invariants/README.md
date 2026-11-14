# Invariants

This suite is owned by no feature. Every test here runs **in full on every
PR**, never scoped to the diff.

See `~/.claude/WORKFLOW.md` §5 for the full rules. Summary:

## When to promote a test here (at build time, step 7 of the loop)

A test belongs here when it guards something durable:

- a security or isolation property (e.g. "an unauthenticated request to a
  portal write route is rejected")
- a contract other code depends on
- a user-visible behavior that must not silently regress
- a critical end-to-end journey (e.g. "Elena can log in and publish an
  entry")

## When NOT to promote

- "the new button is blue" — cosmetic, not durable
- an internal implementation detail
- "the migration ran once" — not a behavior, an event

## Removing an invariant

Allowed when the behavior it guards genuinely no longer exists, on three
conditions:

1. The removal is justified in the commit message.
2. No other property is silently lost with it.
3. It happens in its own change, not buried inside a feature.

Never remove an invariant just to make a build pass — that is the exact
failure this suite exists to prevent.

## What's here now

- `accessibility.spec.ts` — zero automatically-detectable a11y violations
  (via `@axe-core/playwright`) on every public page. Promoted at
  `/sdd-init` because it's a baseline the whole site must hold, not tied to
  one feature.
