# Auth Feature Module

Handles user authentication lifecycle (login, register, session restore, logout) and exposes context + hooks + UI form.

## Goals

- Encapsulate auth state behind `AuthProvider` + `useAuth()`
- Centralize token storage & invalidation
- Provide reusable `LoginForm` component
- Keep external surface minimal & stable

## Structure

```
features/auth/
  hooks/useAuth.tsx      # Context + provider + hook
  components/LoginForm.tsx
  types/auth.ts          # Domain/auth types
  index.ts               # Barrel exports
  README.md              # This file
```

## Public API (via barrel)

- `AuthProvider` (wrap app routing)
- `useAuth()` returns `{ user, loading, login, register, logout }`
- `LoginForm` (optional UI, consumer may build custom forms)
- Types: `AuthUser`, `AuthContextValue`

## Token Handling

- Access token stored in `localStorage` under `auth:token`
- On provider mount / token change: fetch `/auth/me`
- If request fails: token cleared + user reset
- Login & register set token then trigger `fetchMe` by toggling `loading`

## Error Strategy

- Network / 401 errors clear session
- Form-level errors surfaced via thrown `api` error messages (caller decides UI)

## Extensibility Ideas

- Refresh token rotation
- Silent revalidation (interval or background focus event)
- Role-based route guards helper (e.g. `RequireAdmin` component)
- Password reset / email verification flows

## Usage

```tsx
import { AuthProvider } from "@/features/auth";

<AuthProvider>
  <App />
</AuthProvider>;
```

In a component:

```tsx
const { user, login, logout, loading } = useAuth();
```

`LoginForm` is optional; you can implement a custom one calling `login` / `register`.

## Maintenance Checklist

- [ ] `/auth/me` shape matches `AuthUser`
- [ ] Error paths clear token
- [ ] Barrel only exports intended surface
- [ ] No external module imports internal non-exported files

## Future Enhancements

- Add `useRequireAuth` hook for redirect logic
- Add optimistic UI for immediate user state after login
- Add metrics (last login time, session duration)

---

Keep auth complexity isolated here to simplify other features.
