# Elena signs in with email and password only — no second factor

Chosen deliberately for simplicity on Elena's side. Email-link and email-code sign-in were rejected because every sign-in would depend on email delivery, and Supabase's free built-in mailer is heavily rate-limited. An authenticator-app second factor was offered and declined. Mitigations: Supabase's built-in sign-in rate limiting stays enabled and must never be loosened, and Elena uses a long password not used anywhere else. A compromise means defacement of public content only (no third-party data exists — see `specs/threat-model.md`).

## Status

accepted — revisit if the threat model changes (a second account, visitor data).
