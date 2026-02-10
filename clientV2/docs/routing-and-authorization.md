# Routing & Authorization

How the Vue client gates routes, UI elements, and data access based on user privileges and collection grants.

---

## Authentication Bootstrap

How `init.js` authenticates the user via OIDC and preserves the intended route through the login redirect, and how `main.js` restores that route once the Vue router is ready. Once complete, the authorization layer (route guards, privilege checks) takes over.

### The problem

When a user navigates directly to a deep link (e.g., `/#/collection/123/stigs` via bookmark or shared URL) without a valid token, `init.js` redirects to the OIDC provider. The hash fragment is **lost** during this redirect — `window.location.href = authorizationUrl` is a full navigation that discards the fragment entirely. This is true across all supported providers (Keycloak, Okta, Azure Entra ID). RFC 6749 Section 3.1.2 also prohibits fragments in `redirect_uri`.

### The approach: `sessionStorage` keyed by OIDC state nonce

This is the standard approach (recommended by Auth0, used by oidc-client-ts) and fits naturally into the existing `init.js` pattern, which already stores `codeVerifier` and `oidcState` in `sessionStorage`.

1. **Before OIDC redirect** (`init.js` → `handleNoParameters()`): extract and save the intended route to `sessionStorage`, keyed by the OIDC state nonce for cross-tab isolation
2. **After OIDC callback** (`init.js` → `handleRedirectAndParameters()`): retrieve the route by state nonce, move it to a short-lived `oidcReturnTo` key for `main.js`
3. **After router is ready** (`main.js`): read `oidcReturnTo` from `sessionStorage` and call `router.replace()` to navigate to the preserved route
4. **Then** the authorization layer (route guards, described below) checks whether the user has the necessary grants/privileges for that route

**Extracting the intended route (step 1)** depends on routing mode:
- **Hash mode**: the route is in `window.location.hash` (e.g., `#/collection/123` → `/collection/123`). The server pathname (e.g., `/client-v2/`) is ignored — it's the server path, not a client route.
- **History mode**: the route is in `window.location.pathname`, with `historyBase` stripped (e.g., pathname `/client-v2/collection/123` with `historyBase: "/client-v2/"` → `/collection/123`).
- **No deep link** (no hash, or pathname equals the base): `intendedRoute` defaults to `/` and nothing is saved.

Using `router.replace()` (not `push()`) ensures the home route doesn't end up in browser history. Keying by the state nonce during the OP round-trip prevents cross-tab contamination — each tab's auth flow preserves its own intended route independently.

### `redirectUri` and history mode

The `redirectUri` passed to the OIDC provider must be a single, predictable URL registered in the provider's allowed redirect URIs. In hash mode, `redirectUri` is naturally `origin + pathname` (the hash isn't included). In history mode, `pathname` would be the full deep-link path (e.g., `/client-v2/collection/17/stigs`), which varies per route and can't all be registered. So when `historyBase` is set, `redirectUri` uses `origin + historyBase` instead (e.g., `http://host/client-v2/`), giving a single predictable redirect target.

### History mode and `historyBase`

Hash-based routing is the default, but history mode (`createWebHistory`) is needed for environments where URL fragments are stripped from links (common in Teams and email sanitizers). History mode is enabled by setting `STIGMAN_CLIENT_HISTORY_BASE` to the path the app is served at (e.g., `/` or `/instance/`).

### Relative paths and the `<base>` tag

Several resource paths in `index.html` and worker registrations in `init.js` are relative (`init.css`, `./Env.js`, `shield-green-check.svg`, `workers/*.js`). In history mode at a deep route like `/collection/17/stigs`, the browser would resolve these against `/collection/17/` instead of the app root — breaking the bootstrap.

The fix uses the HTML `<base>` element, which sets the document's base URL for all relative path resolution (including `href`, `src`, `new SharedWorker(url)`, and `navigator.serviceWorker.register(url)`):

- **Production**: The API (`api/source/bootstrap/client.js`) injects `<base href="${historyBase}">` into `index.html` when serving requests without a file extension (i.e., SPA fallback routes). This makes relative paths resolve from the configured base (e.g., `/client-v2/`).
- **Dev mode**: A Vite plugin in `vite.config.js` injects `<base href="/">` via `transformIndexHtml` (dev only — `command === 'serve'`). Vite serves all files from `/`, so this is the correct base.
- **Hash mode**: No `<base>` tag is needed because the pathname is always the app root (the route lives in the hash fragment, which doesn't affect path resolution).

Whether injected by the API (production) or the Vite plugin (dev), the `<base>` tag means `index.html` and `init.js` don't need any changes to their relative paths — resolution is handled transparently. The only code in `init.js` that needs routing-mode awareness is `redirectUri` construction and `intendedRoute` extraction, which are about OIDC protocol and route parsing, not resource loading.

---

## Privilege Source: `globalAppStore.user`

The canonical source for privilege and grant data is `globalAppStore.user`, populated at boot from `GET /user`. This object contains:

```
{
  userId, username, displayName, email,
  privileges: { admin: boolean, create_collection: boolean },
  collectionGrants: [
    {
      collection: { collectionId, name },
      roleId,        // 1=Restricted, 2=Full, 3=Manage, 4=Owner
      grantees       // direct and group grant sources
    }
  ]
}
```

**Do NOT parse privileges directly from the OIDC token** (`tokenParsed.realm_access.roles`). The API normalizes token claims via the configurable `STIGMAN_JWT_PRIVILEGES_CLAIM` environment variable — hardcoding `realm_access.roles` breaks for non-Keycloak providers that use different claim paths. The API's `GET /user` response already resolves this, so the client should read from `globalAppStore.user.privileges`.

This also resolves Decision D6 (dual token access pattern). Components should not `inject('worker')` for privilege checks — the worker should be an implementation detail of the auth/fetch layer only.

---

## `useCurrentUser()` Composable

A single composable replaces the scattered `inject('worker')` + token-parsing pattern. It reads from `globalAppStore.user`:

- `user` — the raw user object (reactive)
- `isAdmin` — `computed(() => user.privileges.admin)`
- `canCreateCollection` — `computed(() => user.privileges.create_collection)`
- `getCollectionGrant(collectionId)` — returns the grant object (with `roleId`) or `null`
- `hasCollectionAccess(collectionId)` — `true` if a grant exists
- `getCollectionRoleId(collectionId)` — returns the `roleId` (1-4) or `null`
- `refreshUser()` — re-fetches `GET /user`, updates the store. Used for stale grant recovery (see below)

**Replaces** direct token parsing in: NavTree.vue, NavTreeContent.vue, CustomCards.vue, CollectionSelection.vue.

---

## Route Meta & Navigation Guards

### Route `meta` fields

| Route pattern | `meta` |
|---|---|
| `/admin/*` | `{ requiresAdmin: true }` |
| `/collection/:id/*` | `{ requiresCollectionGrant: true }` |
| `/collection/:id/manage` | `{ requiresCollectionGrant: true, minRoleId: 3 }` |

### Global `beforeEach` guard

1. **Admin routes** (`meta.requiresAdmin`):
   - If user does not have `privileges.admin` → redirect to `/` (home)

2. **Collection routes** (`meta.requiresCollectionGrant`):
   - Look up the `collectionId` route param in `globalAppStore.user.collectionGrants`
   - If **no grant** → redirect to `/collections` with a toast: *"You don't have access to this collection"*
   - If grant exists but `meta.minRoleId` is set and user's `roleId < minRoleId` → redirect to the collection dashboard (they can view but not manage)

3. **Catch-all** (`/:pathMatch(.*)*`):
   - Render a 404 component

### Key design choice

**All users — including admins — must have a grant to access `/collection/:id/*` routes.** Admin privilege only gates the `/admin/*` routes (user management, STIG management, service jobs, app info, admin collections panel). Admins manage collections they don't have grants to through the `/admin/collections` route, which is a separate admin-only view.

---

## Collection Access (Grant-Based)

When a user navigates to `/collection/:collectionId` (via deep link, bookmark, or shared URL):

1. **Route guard** checks `globalAppStore.user.collectionGrants` for a matching `collectionId`
2. **No grant** → redirect to `/collections` + toast notification
3. **Grant exists** → allow navigation. The `roleId` determines available UI features:

| roleId | Role | UI capabilities |
|---|---|---|
| 4 | Owner | Full management, delete collection, modify Owner grants, accept/reject reviews |
| 3 | Manage | Management (assets, STIGs, labels, non-Owner grants), optionally accept/reject |
| 2 | Full | Read/write access to all assets/STIGs, no management |
| 1 | Restricted | Access solely determined by ACL rules (see next section) |

The NavTree already only shows collections the user has grants for (via `GET /collections`). The route guard handles the deep-link/bookmark edge case.

---

## Asset Access Within a Collection (ACL-Based)

Asset-level access is **not** checked at the route level — it requires an API call and is handled at the component level.

### Route: `/collection/:collectionId/asset/:assetId/stig/:benchmarkId`

1. **Route guard** validates collection access (grant exists) — same as above
2. **Component** (`AssetReview`) fetches checklist data using `format=json-access`, which returns an `access` field

### Access levels

| `access` | Behavior |
|---|---|
| `rw` | Full editing: result dropdown, detail/comment fields, save/submit, import, attachments |
| `r` | Read-only: form fields disabled, buttons show "Read only", import/attachments disabled |
| `none` / 403 | Asset not visible to this user — show "no access" message, redirect back to collection dashboard |

### Restricted users (roleId 1)

For Restricted users, the collection dashboard grids naturally reflect ACL filtering — the API only returns assets/STIGs the user has access to. No client-side filtering is needed. The user sees only what their ACL rules permit.

### How ACL rules work

Each grant can have ACL rules that combine a **resource** with an **access level**:

| Resource type | Examples |
|---|---|
| Asset | A specific asset |
| STIG (benchmarkId) | A specific STIG across all assets |
| Label | All assets with a specific label |
| Asset + STIG | A specific asset-STIG combination |
| Label + STIG | Assets with a label, for a specific STIG |

For **Owner/Manage/Full** roles (roleId 2-4): default access is `rw`. ACL rules can only restrict access downward (to `r` or `none`).

For **Restricted** role (roleId 1): default access is `none`. ACL rules are the sole source of access — they grant `r` or `rw` to specific resources.

---

## Handling Stale Grants (403 Recovery)

User grants can change mid-session (e.g., removed from a collection while viewing it). The client handles this:

1. API calls return 403
2. On 403, the client:
   1. Re-fetches the user object (`GET /user`) to update `globalAppStore.user` with current grants/privileges
   2. Re-fetches the collections list (`GET /collections`) so the NavTree reflects the updated grants — the NavTree sources its collection list independently from the user object, so both must be refreshed
   3. Checks if the current route is still accessible with the updated grants
   4. If **no longer accessible** → redirect to `/collections` with a toast: *"Your access to this collection has changed"*
   5. If **still accessible** (403 was for a different reason) → show the error normally

The `refreshUser()` method on `useCurrentUser()` should handle both fetches (user + collections) as a single operation. This can be triggered by a 403 interceptor in `apiClient` or by a handler in the global error composable.

---

## Privilege-Gated UI Elements

Summary of what each privilege/grant level controls and where the check is enforced:

| Check | UI element | Enforcement |
|---|---|---|
| `privileges.admin` | "Application Management" nav section, `/admin/*` routes | Route guard + NavTree |
| `privileges.create_collection` | "Create Collection" action in NavTree | NavTree node visibility |
| Grant exists for collectionId | `/collection/:id/*` routes | Route guard |
| `roleId >= 3` | Collection manage gear, manage link, `/collection/:id/manage` | Route guard + component |
| `roleId === 4` | Delete collection, modify Owner grants | Component |
| `roleId >= minAcceptGrant` | Accept/Reject review buttons | Component (collection setting) |
| `access === 'rw'` (from API) | Review form editing, import, attachments | Component |

---

## Edge Cases

- **Collection deleted while user is viewing it**: API calls fail. The 403 recovery flow handles this (re-fetch user, redirect).
- **Non-default OIDC claim path**: Using `globalAppStore.user.privileges` (API-normalized) instead of direct token parsing ensures correctness regardless of `STIGMAN_JWT_PRIVILEGES_CLAIM` configuration.
- **User navigates to `/collection/:id/manage` with roleId 2 (Full)**: Route guard redirects to the collection dashboard — they can view but not manage.
- **`/admin/collections` vs `/collection/:id/manage`**: Both use the `CollectionManage` component but have different access requirements. The admin route requires `privileges.admin`; the collection route requires a grant with `roleId >= 3`.
