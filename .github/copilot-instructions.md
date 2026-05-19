# FlowDesk Copilot Instructions

## Overall Project Description

FlowDesk is a fullstack TypeScript project management application.

The application is built as a monorepo with a React frontend, an Express/Mongoose backend, and a shared package for domain types, DTOs, input types, constants, and utilities.

The core domain consists of projects, tasks, users, comments, and attachments. The frontend should consume typed API DTOs and keep UI-specific transformations inside hooks, view-model helpers, or components. The backend is responsible for fetching data from MongoDB, joining related entities where needed, calculating API-level aggregations, and mapping database documents to DTOs before returning them.

The main architectural goal is to keep a clear separation between:

- database models and API DTOs
- server state and UI state
- shared domain types and feature-specific UI logic
- backend data preparation and frontend presentation logic

## Project Structure

**Monorepo**: `/client` (React), `/server` (Express), `/shared` (types/constants/utils).

**Aliases**: `@/` → src folder, `@shared/` → /shared folder (both frontend & backend).

**Features**: Organized by domain (`/features/{projects|tasks|users|comments|attachments}`).

```
/client/src/features/{feature}/  → api/, hooks/, components/, types/, constants/
/server/src/features/{feature}/  → models/, routes/, mappers/, services/, types/
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

**Zustand Store** (`/client/src/store/`):

- Use for UI state only (filters, sidebar, badges)
- Never store queryable/server data—use React Query for that
- Organize by slices, use `persist` middleware for persistence

---

## Backend Conventions

**Routes** (`/features/{feature}/routes/`):

- Response format: `{ data: DTO | DTO[] }` or `{ error: string }` with HTTP status
- Always use `.lean()` on Mongoose queries for performance
- Never return raw Mongoose documents; map to DTOs

**Models** (`/features/{feature}/models/`):

- Schema fields should reflect the persisted database shape, not raw API DTOs.
- Keep database models separate from shared DTOs and map between them explicitly.
- Use enums for constrained fields (status, priority, role)

## Identifier & MongoDB Migration Rules

- The project is currently migrating from JSON-style IDs like `p1`, `t1`, `u1` to MongoDB/Mongoose.
- Some existing entities still contain a legacy string `id` field because frontend routes, DTOs, or relations may still depend on it.
- Preserve legacy `id` usage where it already exists.
- Do not add a separate unique `id` field to new models unless the existing feature explicitly requires it.
- Use MongoDB `_id` internally where appropriate, but map database documents to frontend-safe DTOs before returning responses.
- DTOs should expose only the identifier shape expected by the client.

**Mappers** (`/features/{feature}/mappers/`):

- Naming: `to{EntityName}Dto` (transform raw docs → DTO)
- Pure functions with no side effects; accept pre-fetched related data
- Calculate derived fields (progress %, counts, aggregations) here
- Always used before returning data to frontend

**Services** (optional):

- Use only for shared business logic across routes
- Keep as pure functions or data access helpers

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

**Mapping Flow**:

1. Fetch from Mongoose (`.lean()`)
2. Map each doc via `toProjectDto(doc)`
3. Calculate/aggregate in mapper (progress, stats, flattened related data)
4. Return DTOs in response

Example: Route fetches projects, tasks, comments → passes to mapper → returns enriched `ProjectOverviewDto`.

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

❌ **Frontend**: Direct API calls in components; create hooks in `/features/{feature}/hooks/` and use React Query.

❌ **Frontend**: Store server data in Zustand; use React Query for server state.

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
- [ ] Frontend: api/ functions, React Query hooks with proper generics
- [ ] Mutations invalidate queries on success
- [ ] No raw Mongoose documents returned
- [ ] No `any` types
- [ ] Shared utilities used, not re-implemented
