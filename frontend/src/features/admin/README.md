# Admin Feature

Encapsulates administration capabilities: user management, role toggling, GitHub ID assignment, and manager relationship editing.

## Modules

- `types.ts` shared types
- `services/adminApi.ts` raw API layer (thin wrapper around `api`)
- `hooks/useAdminUsers.ts` stateful hook handling fetch/mutations and busy flags
- `components/` all admin UI widgets:
  - `AdminGate`, `RequireAdminRoute`
  - `AdminUserRow`, `RowMenu`
  - `ManagerDrawer`
  - `CreateUserModal`, `FormField`

## Hook: useAdminUsers

Responsibilities:

- Load users list
- Provide create/delete/update (GitHub, admin flag, manager links)
- Expose granular busy state sets for fine‑grained UI disabling

## AdminGate

Usage:

```tsx
import { AdminGate } from "@/features/admin";

<AdminGate>
  <SensitiveAdminPanel />
</AdminGate>;
```

Pass a `fallback` prop to override the default "Acesso negado" block.

## Future Enhancements

- Pagination / server-side filtering
- React Query integration for cache normalization
- Optimistic updates for faster UX
- Permission matrix beyond simple `isAdmin`
- Extract table into reusable DataGrid-like component
