# Withdraw App

A USDT withdrawal page built with Next.js 16, Zustand, React Hook Form, and Zod.

## How to run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/withdraw](http://localhost:3000/withdraw).

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run typecheck    # TypeScript check
npm test             # unit tests
npm run test:e2e     # E2E tests (Playwright)
```

## What's implemented

**Core flow:**

- Amount, destination, and confirmation checkbox with Zod validation
- Submit is disabled until the form is valid and during the request
- On submit, POSTs to `/api/v1/withdrawals` and then fetches the created withdrawal via `GET /api/v1/withdrawals/{id}` to show the server-confirmed status
- 409 Conflict and network errors are shown in a dedicated error state
- Network errors show a Retry button; the form pre-fills with the last entered values so the user doesn't have to retype

**Resilience:**

- Double-submit is prevented: the submit button is disabled and the store ignores calls while `status === 'loading'`
- Every request carries an `idempotency_key` (UUID). Retries reuse the same key, so even if the server receives the request twice it won't create a duplicate withdrawal. A new key is generated only when the user explicitly resets the form.

**Reload recovery:**

- After a successful submission, only the withdrawal **ID** is saved to `sessionStorage` with a 5-minute TTL. On the next page load, the app fetches that ID from the server and restores the success state. No sensitive data (amount, address) is ever stored on the client.

## Auth — mock vs production

Auth is mocked in this implementation (no real tokens). In production:

The API would issue a short-lived JWT as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. This means JavaScript never has access to the token, which closes the main XSS attack vector. Next.js Middleware would check for the cookie and redirect unauthenticated users before any page renders. Refresh tokens would also live in an `HttpOnly` cookie and be rotated server-side silently.

`localStorage` and `sessionStorage` are not used for tokens because any XSS script can read them. Cookies with the right flags cannot be read by JavaScript at all.

## Key decisions and trade-offs

**Zustand over Context/Redux**

Zustand gives per-field subscriptions, so components only re-render when the specific slice of state they use changes. With Context, any state change re-renders the entire tree under the provider. Redux would work too but adds significant boilerplate for a single-feature app. The trade-off is that Zustand has less ecosystem tooling (no time-travel debugger out of the box), but for this scope that doesn't matter.

**Client-side idempotency key**

The key is generated in the browser via `crypto.randomUUID()`. This is simple and doesn't require a server round-trip. The trade-off is that if the user opens the same form in two tabs simultaneously and submits from both, they get two different keys and two withdrawals. In production a server-issued key (tied to a session) would prevent that. For a single-user, single-tab flow this is fine.

**sessionStorage for reload recovery instead of localStorage**

`sessionStorage` is scoped to the browser tab and is cleared when the tab is closed. `localStorage` persists across sessions and tabs — stronger than we need and a slightly larger exposure surface. Neither is appropriate for tokens, but for an opaque withdrawal ID (no financial value on its own) `sessionStorage` is acceptable.

**GET after POST instead of trusting the POST response**

The POST response already contains the withdrawal data, so a second GET request might seem redundant. The reason to call GET is that in a real system the POST might return a `202 Accepted` with an initial `pending` status, and the actual status (approved/rejected) would only be visible via GET. Building this pattern now means the UI already handles async status correctly.

## Tests

Unit tests cover the happy-path, 409 error, and double-submit guard.
E2E tests (Playwright, Chromium) cover the full happy-path flow and 409 conflict via network interception.
