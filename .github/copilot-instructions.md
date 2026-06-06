# FlowDesk Copilot Instructions

## Overall Project Description

FlowDesk is a fullstack TypeScript project operations dashboard.

The application is built as a monorepo with a React frontend, an Express/Mongoose backend, and a shared package for domain types, DTOs, input types, constants, and utilities.

The core domain consists of projects, tasks, users, comments, attachments, authentication, dashboard analytics, and settings. The frontend should consume typed API DTOs and keep UI-specific transformations inside hooks, view-model helpers, or components. The backend is responsible for authentication, authorization, fetching data from MongoDB, joining related entities where needed, calculating API-level aggregations, and mapping database documents to DTOs before returning them.

The main architectural goal is to keep a clear separation between:

- database models and API DTOs
- server state and UI state
- shared domain types and feature-specific UI logic
- backend data preparation and frontend presentation logic
- authenticated user access and project-level authorization

## Project Structure

**Monorepo**: `/client` (React), `/server` (Express), `/shared` (types/constants/utils).

**Aliases**: `@/` → src folder, `@shared/` → /shared folder (both frontend & backend).

**Features**: Organized by domain (`/features/{auth|dashboard|projects|tasks|users|comments|attachments|settings}`).

```
/client/src/features/{feature}/  → api/, hooks/, components/, types/, constants/
/server/src/features/{feature}/  → models/, routes/, mappers/, services/, types/, validators/
```

---

## Frontend Conventions

**API Layer** (`/features/{feature}/api/`):

- Functions: `fetch{Resource}`, `create{Resource}`, `update{Resource}`, `delete{Resource}`
- Always use `apiClient` (Axios at `@/shared/api/client`)
- Return types are DTOs from `@shared/types/dto/` or base types from `@shared/types/`

**React Query Hooks** (`/features/{feature}/hooks/`):

- Query: `use{Resource}` with `useQuery<DataType, ErrorType>`
- Mutation: `use{Create|Update|Delete}{Resource}` with `useMutation<ResponseType, ErrorType, InputType>`
- Always invalidate related queries on mutation success
- Mutations live in `/hooks/mutations/` subdirectory
- Auth server state uses the `["auth", "me"]` query key.
- Login/register should set or refresh the current-user cache when they receive a user.
- Logout should clear the current-user cache intentionally.

**Zustand Store** (`/client/src/store/`):

- Use for UI state only (filters, sidebar, badges)
- Never store queryable/server data—use React Query for that
- Organize by slices, use `persist` middleware for persistence

**Auth UI**:

- Public routes use the auth feature (`/features/auth`) for login/register views.
- Protected frontend routes use `useCurrentUser` and redirect unauthenticated users to `/login`.
- Do not store JWTs in frontend state or localStorage; authentication is cookie-based.

---

## Backend Conventions

**Routes** (`/features/{feature}/routes/`):

- Response format: `{ data: DTO | DTO[] }` or `{ error: string }` with HTTP status
- Always use `.lean()` on Mongoose queries for performance
- Never return raw Mongoose documents; map to DTOs
- Protected routes are mounted behind `requireAuth` in `server/src/app.ts`.
- Inside protected route handlers, read the authenticated user from `req.user?.id`.
- Return `401` if a protected handler cannot resolve `req.user?.id`.

**Models** (`/features/{feature}/models/`):

- Schema fields should reflect the persisted database shape, not raw API DTOs.
- Keep database models separate from shared DTOs and map between them explicitly.
- Use enums for constrained fields (status, priority, role)

## Authentication & Authorization

- Authentication uses JWT access tokens stored in an HttpOnly cookie.
- The backend auth middleware verifies the cookie token and attaches `{ id }` to `req.user`.
- Frontend auth state is loaded through `/auth/me` and React Query.
- Do not expose password hashes, JWTs, or raw auth internals to the frontend.
- Password updates must verify the current password and hash the new password on the backend.

## Project Access Rules

- Projects are user-scoped.
- Each project has an `ownerId`.
- A user can read a project if:
  - `project.ownerId === req.user.id`
  - or `project.invitedUserIds` contains `req.user.id`
- Newly registered users should not see demo project data.
- Demo data belongs to a dedicated demo user.
- Do not use unscoped project queries in protected routes.
- Prefer the project access services in `server/src/features/projects/services/project.service.ts`:
  - `getProjects(userId)`
  - `getProjectById({ projectId, userId })`
- When querying related entities such as tasks, comments, attachments, dashboard stats, or project options, first scope the projects to the authenticated user, then query related data by those project IDs.
- Owner-only actions may require stricter checks than read access. Do not assume invited members can perform destructive actions unless the feature explicitly allows it.

## Identifier & MongoDB Rules

- FlowDesk now uses real MongoDB/Mongoose `_id` values.
- Do not introduce fake JSON-style IDs such as `p1`, `t1`, or `u1` for new records.
- Persist relationships as stringified MongoDB IDs where the current models expect strings.
- Use MongoDB `_id` in backend queries.
- Map database `_id` to DTO `id` before returning responses.
- DTOs expose frontend-safe identifiers; frontend code should not depend on Mongoose internals like `_id` or `__v`.

**Mappers** (`/features/{feature}/mappers/`):

- Naming: `to{EntityName}Dto` (transform raw docs → DTO)
- Pure functions with no side effects; accept pre-fetched related data
- Calculate derived fields (progress %, counts, aggregations) here
- Always used before returning data to frontend

**Services** (optional):

- Use for shared business logic across routes
- Use for reusable data access helpers, especially auth-aware project access
- Keep mapper functions pure; put database access in routes or services
- Do not duplicate authorization query logic across many routes when a service exists

---

## Shared Types & DTOs

**Locations**:

- Domain types (entities): `/shared/types/{project|task|user|...}.ts` → `Project`, `Task`, `User`
- Request inputs: `/shared/types/inputs/{action}{Entity}Input.ts` → `CreateProjectInput`
- Response DTOs: `/shared/types/dto/{domain}/{entity}.dto.ts` → `ProjectSummariesDto`, `UserPreviewDto`
- Constants: `/shared/constants/` → `DEFAULT_PAGE`, `PAGE_LIMITS`
- Utilities: `/shared/utils/` → `getStatusFromProgress`, `calcPercent`

**Rules**:

- Domain types (no suffix) used by both frontend & backend
- DTOs end with `Dto`; inputs end with `Input`
- Never import backend models in frontend
- Never duplicate shared types in feature folders

---

## API Response & Database Mapping

**Response Format**:

- Query: `{ data: ProjectSummariesDto[] }`
- Paginated: `{ data: { items: DTO[], page, limit, total } }`
- Single entity: `{ data: ProjectDto }`
- Error: `{ error: string }` with status code
- Auth and simple action endpoints may return `{ message: string }`; prefer consistent error shapes when adding new endpoints.

**Mapping Flow**:

1. Fetch from Mongoose (`.lean()`)
2. Map each doc via `toProjectDto(doc)`
3. Calculate/aggregate in mapper (progress, stats, flattened related data)
4. Return DTOs in response

Example: Route fetches projects, tasks, comments → passes to mapper → returns enriched `ProjectOverviewDto`.

**Scoped Mapping Flow**:

1. Resolve `userId` from `req.user?.id`
2. Fetch only accessible projects via project access service
3. Fetch related tasks/comments/attachments/dashboard data by accessible project IDs
4. Map database documents to DTOs
5. Return the scoped DTO response

---

## TypeScript Conventions

- Strict mode enabled
- No `any` types; use specific types or narrow from `unknown`
- Always declare return types for functions
- Use type inference for obvious cases (`const count = 5`)
- React Query: always use full generics `useQuery<Data, Error>`, `useMutation<Response, Error, Input>`
- Prefer named exports; use `import type` for types to avoid circular imports

---

## Naming Conventions

| Category         | Pattern              | Example                                       |
| ---------------- | -------------------- | --------------------------------------------- |
| Types/Interfaces | PascalCase           | `Project`, `UserRole`                         |
| DTOs             | PascalCase + `Dto`   | `ProjectSummariesDto`                         |
| Inputs           | PascalCase + `Input` | `CreateProjectInput`                          |
| Functions        | camelCase            | `fetchProjects`, `toProjectDto`               |
| Constants        | UPPER_SNAKE_CASE     | `DEFAULT_PAGE`, `MAX_PAGE_LIMIT`              |
| React Hooks      | `use{Name}`          | `useProjects`, `useCreateProject`             |
| Components       | PascalCase           | `ProjectCard`, `TaskForm`                     |
| Files            | kebab-case           | `project-summary.mapper.ts`, `useProjects.ts` |
| Mappers          | `to{DtoName}`        | `toProjectDto`, `toUserPreviewDto`            |

---

## Anti-Patterns to Avoid

❌ **Backend**: Return raw Mongoose documents; use `.map(toProjectDto)` instead.

❌ **Backend**: Query database inside mappers; pass pre-fetched data instead.

❌ **Backend**: Use unscoped `ProjectModel.find()` / `findById()` in protected routes when data should be limited to the authenticated user.

❌ **Backend**: Let newly registered users see seeded demo data unless they are the demo user.

❌ **Frontend**: Direct API calls in components; create hooks in `/features/{feature}/hooks/` and use React Query.

❌ **Frontend**: Store server data in Zustand; use React Query for server state.

❌ **Frontend**: Store JWTs or auth tokens in localStorage/sessionStorage.

❌ **Frontend**: Forget to invalidate queries after mutations.

❌ **General**: Use `any` types; declare proper types.

❌ **General**: Duplicate shared types in feature folders; import from `@shared/types/`.

❌ **General**: Hardcode magic values; use constants from `@shared/constants/`.

❌ **General**: Import across feature boundaries; coordinate via routes or shared services.

---

## Checklist for New Features

- [ ] Domain type in `@shared/types/`
- [ ] DTO in `@shared/types/dto/` with `Dto` suffix
- [ ] Input type in `@shared/types/inputs/` with `Input` suffix
- [ ] Backend: model, mapper, routes returning mapped DTOs
- [ ] Backend: auth/authorization requirements checked
- [ ] Backend: project-related data scoped by `req.user.id`
- [ ] Frontend: api/ functions, React Query hooks with proper generics
- [ ] Mutations invalidate queries on success
- [ ] Auth mutations update or clear the `["auth", "me"]` cache where relevant
- [ ] No raw Mongoose documents returned
- [ ] No `any` types
- [ ] Shared utilities used, not re-implemented
