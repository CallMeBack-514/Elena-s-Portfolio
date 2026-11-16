# Custom Portal on Supabase instead of a ready-made CMS

Elena must update the site herself with a plain email sign-in (no GitHub account), and the project is also a vehicle for the Maintainer to learn and exercise their spec-driven workflow, auth included. We therefore build our own Portal on Supabase (managed auth, Postgres, storage on the free plan) rather than adopting a git-based CMS (Keystatic, Decap — these require GitHub sign-in) or a hosted headless CMS.

## Consequences

- Auth, write routes, uploads and sessions become Critical-track work we own (see `specs/threat-model.md`).
- The free plan's limits shape later decisions: projects pause after ~7 days idle (ADR-0003), 1 GB storage and no server-side image transforms (ADR-0008).
