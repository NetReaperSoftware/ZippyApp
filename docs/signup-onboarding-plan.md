# Signup → Provisioning → Onboarding

Status: **planned, not started**. Written 2026-07-31.

## Goal

1. Visitor submits their email from the landing page.
2. They land in a users table with a UUID and related fields.
3. They are automatically emailed a way to log in.
4. On first login they answer onboarding questions (what they want to use the app for, etc.).

## Governing constraint

**HighLevel is not an identity provider.** It has no logins, sessions, or tokens, so the
credential half has to come from Supabase Auth — already wired up in `contexts/AuthContext.tsx`
(`signUp`, `signIn`, `resetPassword`). HighLevel does what it is actually good at: the CRM
record, the branded email, and the automation that follows.

Split of responsibility:

| Concern | Owner |
|---|---|
| Identity, UUID, sessions, password | Supabase Auth |
| App data, onboarding answers | Supabase Postgres |
| CRM record, segmentation, nurture | HighLevel |
| Email delivery (branded, tracked) | HighLevel |
| Rep/referral attribution | HighLevel affiliate system |

## Flow

```
Landing form → HighLevel contact created (+ rep attribution)
                     ↓ workflow webhook
        Supabase Edge Function
          • create auth user  → UUID
          • generateLink()    → action link, NOT emailed
          • write profiles row, store GHL contact id
          • return link to HighLevel
                     ↓
        HighLevel sends branded email containing the link
                     ↓
        User taps → app opens → sets password → onboarding questions
                     ↓
        Answers → Supabase + synced to GHL custom fields
```

The detail that makes this work: **`supabase.auth.admin.generateLink()` returns an action link
without sending an email.** That hands the send to HighLevel (branded, tracked, can trigger
follow-on sequences) while Supabase still owns the credential.

## Decision: do not email a generated password

Emailed passwords persist in the inbox forever, travel over an insecure channel, and are never
rotated. Use an **invite link where the user sets their own password**, or a 6-digit OTP. The
user experience is the same — click the email, get in. This is a one-line change in the Edge
Function if we decide otherwise.

## Steps

### 1. Schema — `supabase/migrations/` (currently empty)

- `profiles`: `id` (FK → `auth.users`), `email`, `highlevel_contact_id`, `onboarding_completed`,
  `trial_ends_at`, `referred_by_rep`, `created_at`
- `onboarding_responses`: `user_id`, business type, primary goal, team size, current tools
- RLS: a user can read/write only their own rows
- Trigger: insert a `profiles` row whenever an `auth.users` row is created

### 2. Edge Function — `supabase/functions/` (currently empty)

Handles provisioning end to end: create the auth user, generate the action link, upsert the
HighLevel contact, write `profiles`, return the link.

**Secrets live here and nowhere else — the service-role key and GHL API key must never reach the
app bundle.** Note that `env.d.ts:5` still declares `SUPABASE_SERVICE_ROLE_KEY` even though
nothing imports it; this is exactly the flow where someone would be tempted to use it
client-side, which would ship a god-mode key to every device. Delete that declaration.

### 3. Capture — landing page

Embed a HighLevel form rather than posting to our own endpoint. Gets spam protection, native CRM
capture, rep attribution, and workflow triggering for free. Cost: `landing/index.html` loses its
current zero-JS property.

### 4. App changes

- `App.tsx` — `linking.prefixes` are still `https://zippyapp.com` / `zippyapp://`; they need to
  be `myzippy.app`
- Set-password screen for the invite deep link (`screens/PasswordResetScreen.tsx` is close)
- `RootNavigator` gains a third state: authenticated **but not onboarded** → onboarding stack
- Onboarding answers write to Supabase *and* sync to GHL custom fields, so segmentation and
  automation can act on them
- Turn off `SKIP_AUTH_FOR_UI_DEV` (`App.tsx`) and `DEV_ROLE_OVERRIDE` (`contexts/AuthContext.tsx`)

### 5. Sequencing

Build steps 1, 2 and 4 against the real Supabase project first, triggering the function by hand.
Wire HighLevel last — it gives the least feedback when it misbehaves.

## Watch out for

- **Two sources of truth.** Supabase owns identity, HighLevel owns the CRM record. Store each ID
  on the other and pick one authoritative side per field, or they will drift.
- **This is the opposite of the demo.** The public demo deliberately has no signup. Whatever
  deploys to GitHub Pages must keep `SKIP_AUTH_FOR_UI_DEV = true`, or prospects hit a login wall.
- **Trial expiry is undecided.** Does day 15 lock the app, or only start a HighLevel nurture
  sequence?

## Related

- Product context: `LaunchBluePrint.pdf`
- Data seam already in place: `hooks/index.ts` returns `{ data, loading, error }` from
  `services/mockData.ts`; swapping a hook's body to a real call needs no screen changes.
