# Implementation Patterns & Consistency Rules

## Naming Patterns

**Database Naming (PostgreSQL):**

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | snake_case, plural | `users`, `listings`, `community_posts` |
| Columns | snake_case | `created_at`, `user_id`, `display_name` |
| Foreign keys | `{referenced_table_singular}_id` | `user_id`, `listing_id` |
| Indexes | `idx_{table}_{columns}` | `idx_users_email`, `idx_listings_area_category` |
| Enums | snake_case type, UPPER values | `user_role` type: `GUEST`, `USER`, `BUSINESS_OWNER`, `ADMIN` |
| Timestamps | Always `created_at`, `updated_at` | UTC stored, formatted per locale in frontend |

**API Naming (FastAPI):**

| Element | Convention | Example |
|---------|-----------|---------|
| Endpoints | snake_case, plural nouns | `/api/v1/listings`, `/api/v1/community_posts` |
| Route params | snake_case | `/api/v1/listings/{listing_id}` |
| Query params | snake_case | `?category_id=5&sort_by=rating` |
| JSON fields | snake_case (Python standard) | `{ "user_id": "uuid", "display_name": "Tanaka" }` |

**Frontend Code Naming (TypeScript/React):**

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `ListingCard.tsx`, `SenpaiPicks.tsx` |
| Files (components) | PascalCase matching component | `ListingCard.tsx` |
| Files (utils/hooks) | camelCase | `useListings.ts`, `formatPrice.ts` |
| Functions | camelCase | `getListingById()`, `formatDualPrice()` |
| Variables | camelCase | `userId`, `listingData` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `API_BASE_URL` |
| Types/Interfaces | PascalCase | `Listing`, `UserProfile`, `CreateListingRequest` |

**Backend Code Naming (Python):**

| Element | Convention | Example |
|---------|-----------|---------|
| Files/modules | snake_case | `listing_service.py`, `auth_middleware.py` |
| Classes | PascalCase | `ListingService`, `UserRepository` |
| Functions | snake_case | `get_listing_by_id()`, `create_review()` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `JWT_SECRET_KEY` |
| Pydantic models | `{Entity}{Context}{Request/Response}` | `ListingCreateRequest`, `ListingDetailResponse`, `ListingListResponse` |
| SQLAlchemy models | PascalCase singular | `User`, `Listing`, `CommunityPost` |

**API Client Auto-Transform (snake_case ↔ camelCase):**

Frontend API client includes interceptors that automatically transform snake_case (backend) to camelCase (frontend) on responses, and camelCase to snake_case on requests. All frontend code uses camelCase naturally — zero manual conversion.

## Structure Patterns

**Backend Module Structure (every module follows this exactly):**

```
backend/modules/{module_name}/
├── __init__.py
├── router.py          # FastAPI router — API endpoints
├── service.py         # Business logic
├── repository.py      # Database queries (SQLAlchemy)
├── models.py          # SQLAlchemy ORM models
├── schemas.py         # Pydantic request/response schemas
├── events.py          # Event definitions and handlers
├── exceptions.py      # Module-specific exceptions
└── constants.py       # Module constants
```

**Frontend Module Structure:**

```
apps/web/modules/{module_name}/
├── components/        # Module-specific components
├── hooks/             # Module-specific hooks
├── lib/               # Module utilities
└── types/             # Module-specific types (auto-generated from OpenAPI)
```

**Test Locations:**

| Layer | Convention | Example |
|-------|-----------|---------|
| Backend | `backend/tests/{module_name}/` mirroring module structure | `tests/listing/test_service.py` |
| Frontend | Co-located `__tests__/` within each module | `modules/user/components/__tests__/ListingCard.test.tsx` |
| E2E | `e2e/` at project root | `e2e/listing-flow.spec.ts` |

**Test Naming Conventions:**

```python
# Backend: test_{action}_{scenario}_{expected_result}
def test_create_listing_with_valid_data_returns_201():
def test_create_listing_without_auth_returns_401():
def test_search_listings_japanese_query_returns_vietnamese_content():
```

```typescript
// Frontend: describe → it("should {action} when {condition}")
describe("ListingCard", () => {
  it("should display dual currency when listing has price", () => {});
  it("should show skeleton when loading", () => {});
  it("should show senpai badge when reviewer is senpai", () => {});
});
```

**Test Coverage Targets:**

| Layer | Target | Notes |
|-------|--------|-------|
| Backend service layer | 80% line coverage | Core business logic |
| Backend auth/security | 100% line coverage | Critical path |
| Frontend components | Render tests required for all components | At minimum: renders without error |
| Frontend critical flows | Integration tests | Search → detail → save flow |
| E2E | Happy path per user journey | 4 journeys = 4 E2E suites |

**Test Database Strategy:**

```python
# pytest fixtures with transaction rollback — clean state per test
@pytest.fixture
async def db_session():
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn)
        yield session
        await conn.rollback()
```

## Format Patterns

**API Response Wrapper:**

```json
// Success (list)
{
  "data": [ ... ],
  "meta": { "page": 1, "total": 50, "per_page": 20 }
}

// Success (single)
{
  "data": { "id": "uuid", "name": "..." }
}

// Error
{
  "error": {
    "code": "LISTING_NOT_FOUND",
    "message_ja": "リスティングが見つかりません",
    "message_vi": "Không tìm thấy danh sách",
    "message_en": "Listing not found",
    "detail": null
  }
}
```

**Date/Time Format:**

| Context | Format | Example |
|---------|--------|---------|
| Database | UTC timestamp | `2026-04-10T08:00:00Z` |
| API JSON | ISO 8601 string (UTC) | `"2026-04-10T08:00:00Z"` |
| UI (Japanese) | `YYYY年MM月DD日 HH:mm` | `2026年4月10日 17:00` |
| UI (Vietnamese) | `DD/MM/YYYY HH:mm` | `10/04/2026 17:00` |

**Pagination:** `GET /api/v1/listings?page=1&per_page=20&sort_by=rating&sort_order=desc`

**ID Format:** UUID v4 for all primary keys — no auto-increment integers exposed in API.

## Communication Patterns

**Event Naming:** `{module}.{entity}.{action}` in snake_case

| Example | Trigger |
|---------|---------|
| `listing.listing.created` | BusinessOwner publishes listing |
| `review.review.created` | User writes review |
| `gamification.user.badge_upgraded` | User hits point threshold |

**Event Payload Standard:**

```python
{
    "event": "listing.listing.created",
    "timestamp": "2026-04-10T08:00:00Z",
    "actor_id": "uuid-of-user",
    "payload": { "listing_id": "uuid", "business_owner_id": "uuid" }
}
```

**Zustand Store Pattern:** One store per domain concern, not one global store. Stores: `useAuthStore`, `useFavoritesStore`, `useNotificationStore`.

**TanStack Query Key Convention:** `[module, entity, ...params]` — e.g., `['listing', 'detail', listingId]`, `['community', 'posts', groupId]`.

## Process Patterns

**Dependency Injection (Module Boundary Enforcement):**

```python
# ✅ CORRECT — dependency injection via FastAPI Depends
async def get_listing_service(
    repo: ListingRepository = Depends(get_listing_repository),
    translation: TranslationService = Depends(get_translation_service),
) -> ListingService:
    return ListingService(repo, translation)

# ❌ FORBIDDEN — direct module import
from modules.translation.service import TranslationService
```

Modules communicate ONLY through Dependency Injection or Event Bus. Never import another module directly.

**Environment Configuration:**

```python
# ✅ CORRECT — centralized Pydantic Settings
# backend/shared/config.py
class Settings(BaseSettings):
    database_url: str
    redis_url: str
    meilisearch_url: str
    jwt_secret: str
    translation_api_key: str
    do_spaces_key: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
# All modules import from shared.config — NEVER use os.getenv() directly
```

**Error Handling (Backend):**

```python
# Module-specific exceptions inherit from base AppException
class AppException(Exception):
    def __init__(self, code: str, message_ja: str, message_vi: str, message_en: str, status_code: int = 400): ...

class ListingNotFoundException(AppException):
    def __init__(self, listing_id: str):
        super().__init__(code="LISTING_NOT_FOUND", message_ja="リスティングが見つかりません", ...)

# Global exception handler catches AppException → JSON error response
```

**Error Handling (Frontend):** TanStack Query error boundary + toast notification. NEVER show raw error messages. Always use locale-appropriate message from API response. Fallback: generic polite message.

**Loading State Pattern:** `isLoading` (first load) → Skeleton component. `isFetching` (refetch) → Subtle indicator, NOT full skeleton. `isError` → Polite message + retry button. NEVER use spinners — always skeleton matching layout.

**Soft Delete Pattern:** All user-generated content uses soft delete. `deleted_at: Optional[datetime]` — NULL = active, timestamp = deleted. Repository queries filter `WHERE deleted_at IS NULL` by default. Hard delete only via admin action or data retention policy.

**Alembic Migration Naming:** `{YYYY}_{MM}_{DD}_{HHMM}_{description}.py` — e.g., `2026_04_10_0800_create_users_table.py`

**TypeScript Type Generation from OpenAPI:**

```bash
# Auto-generate frontend types from backend OpenAPI schema
# packages/types/generate.sh
curl http://localhost:8000/openapi.json > openapi.json
npx openapi-typescript openapi.json -o ./src/api-types.ts
```

Zero manual type duplication between backend and frontend. This MUST run as part of the development workflow whenever backend schemas change.

**Docker Compose Profiles:**

```yaml
services:
  postgres:
    profiles: ["infra", "full"]
  redis:
    profiles: ["infra", "full"]
  meilisearch:
    profiles: ["infra", "full"]
  backend:
    profiles: ["backend", "full"]
  web:
    profiles: ["frontend", "full"]
# docker compose --profile infra up    ← DB/Redis/Meili only, run code locally
# docker compose --profile full up     ← everything containerized
```

## Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly — no exceptions, no variations
2. Use the module structure template for every new module (backend and frontend)
3. Wrap all API responses in the standard response format
4. Use UUID v4 for all new entity IDs
5. Store all timestamps in UTC, format per locale only in frontend
6. Handle errors through AppException hierarchy, never raise raw exceptions
7. Use skeleton loading, never spinners
8. Apply soft delete for all user-generated content
9. Fire events for cross-module side effects, never import other modules directly
10. Use Dependency Injection via FastAPI Depends for all service dependencies
11. Use centralized Pydantic Settings — never `os.getenv()` directly
12. Auto-generate TypeScript types from OpenAPI — never manually duplicate types
13. Write tests following naming conventions and coverage targets

**Anti-Patterns (FORBIDDEN):**

- ❌ `camelCase` in database columns or API JSON fields
- ❌ Auto-increment IDs exposed in API URLs
- ❌ Direct module-to-module imports in backend
- ❌ Raw error messages shown to users
- ❌ Spinner loading indicators
- ❌ Hard-deleting user content without soft-delete first
- ❌ Storing timestamps in local timezone
- ❌ `any` type in TypeScript (use `unknown` + type guards)
- ❌ Inline SQL queries (always use repository pattern)
- ❌ `os.getenv()` in module code (use shared Settings)
- ❌ Manual TypeScript type definitions duplicating Pydantic schemas
