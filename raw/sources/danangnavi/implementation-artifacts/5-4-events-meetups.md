# Story 5.4: Events & Meetups

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user wanting to make friends in Da Nang,
I want to browse and register for community events and meetups,
So that I can meet other Japanese expats in person and build real connections.

## Acceptance Criteria

1. **Given** I navigate to the events page at `/ja/community/events` (FR23)
   **When** the page loads
   **Then** a list/calendar toggle (SegmentedControl) allows switching between list and calendar views
   **And** filter chips display: すべて, 今週, 今月, 初心者歓迎

2. **Given** the events list view
   **When** events are displayed
   **Then** event cards show: cover photo (240px × 120px), title, date/time with 📅 icon, location with 📍 icon, attendee avatar stack (3 overlapping 24px avatars) + "X人参加予定" count
   **And** events tagged "初心者歓迎" (Newcomers Welcome) show a teal pill badge

3. **Given** I tap an event card (FR24)
   **When** the event detail displays at `/ja/community/events/[event_id]`
   **Then** full details show: title, description, date/time, location (with map link), organizer info, attendee list, and "参加する" (Join) CTA button

4. **Given** I tap "参加する" on an event
   **When** I am logged in
   **Then** a confirmation modal appears with checkmark animation
   **And** I am added to the attendee list
   **And** the attendee count updates
   **And** an event registered event fires (triggers gamification + notification reminder)

5. **Given** I am not logged in and tap "参加する"
   **When** the auth check triggers
   **Then** the signup modal appears, and after login, the registration completes

6. **Given** no events match the selected filter
   **When** the empty state displays
   **Then** a friendly message shows "イベントはまだありません" with a suggestion to check back later

## Tasks / Subtasks

### Backend — Event Schemas

- [x] Task 1: Add event Pydantic schemas (AC: #1-4)
  - [x] 1.1 `EventListItem` in `schemas.py`: id, title, cover_photo_url, event_date, location, attendee_count, attendee_avatars (max 3), is_newcomer_friendly, is_registered (bool | None — null if guest)
  - [x] 1.2 `EventAttendee`: user_id, display_name, avatar_url, badge_level
  - [x] 1.3 `EventDetailResponse`: id, title, description, cover_photo_url, event_date, location, group (GroupBriefInfo | None), organizer (AuthorInfo | None), attendee_count, attendees (list[EventAttendee], max 30), is_newcomer_friendly, is_registered (bool | None)
  - [x] 1.4 `EventRegistrationResponse`: registered (bool), attendee_count (int)
  - [x] 1.5 `EventListFilter` enum/Literal: `all | this_week | this_month | newcomer_friendly`

### Backend — Event Repository Methods

- [x] Task 2: Add repository methods (AC: #1-4)
  - [x] 2.1 `list_events(filter: EventListFilter, page: int, per_page: int) -> tuple[list[Row], int]` — paginated, filter on event_date range / is_newcomer_friendly. Always `event_date >= now` (upcoming only). Order by `event_date ASC`. Return rows with attendee_count via correlated subquery (reuse pattern from `upcoming_events`).
  - [x] 2.2 `get_event_by_id(event_id: UUID) -> Event | None` — soft-delete aware
  - [x] 2.3 `list_event_attendees(event_id: UUID, limit: int = 30) -> list[Row]` — JOIN `event_registrations` + `users` + `senpai_badge_progress` (or whatever provides badge_level). Order by registration created_at ASC. Return user_id, display_name, avatar_url, badge_level.
  - [x] 2.4 `find_event_registration(event_id: UUID, user_id: UUID) -> EventRegistration | None` — include soft-deleted
  - [x] 2.5 `create_event_registration(event_id: UUID, user_id: UUID) -> EventRegistration` — handle re-register: clear `deleted_at` if soft-deleted row exists
  - [x] 2.6 `soft_delete_event_registration(reg: EventRegistration) -> None`
  - [x] 2.7 `count_event_attendees(event_id: UUID) -> int` — single COUNT query, deleted_at IS NULL
  - [x] 2.8 `get_user_event_registration_status(event_id: UUID, user_id: UUID) -> bool` — for `is_registered` field on detail
  - [x] 2.9 `get_user_event_registration_statuses(event_ids: list[UUID], user_id: UUID) -> dict[UUID, bool]` — batch for list endpoint (avoid N+1)

### Backend — Event Service Methods

- [x] Task 3: Add service methods (AC: #1-6)
  - [x] 3.1 `list_events(filter: EventListFilter, page, per_page, user_id: UUID | None) -> tuple[list[EventListItem], PageMeta]` — call repo, batch-resolve `is_registered` if user_id provided, batch-resolve avatars via existing `get_attendee_avatars`
  - [x] 3.2 `get_event_detail(event_id, user_id: UUID | None) -> EventDetailResponse` — fetch event, attendees, organizer, group; raise `EventNotFoundException` if missing
  - [x] 3.3 `register_for_event(user_id: UUID, event_id: UUID) -> EventRegistrationResponse` — validate event exists + event_date >= now (raise `EventAlreadyEndedException` if past). Find existing registration → if active, raise `AlreadyRegisteredException` (409); if soft-deleted, restore (clear deleted_at); else create. Commit. Re-fetch attendee count. Emit `COMMUNITY_EVENT_ATTENDANCE_CONFIRMED_EVENT` with payload `{user_id, event_id, attendance_id}`. Return response.
  - [x] 3.4 `cancel_event_registration(user_id: UUID, event_id: UUID) -> EventRegistrationResponse` — find active registration, soft-delete (set deleted_at). Commit. Return updated count.
  - [x] 3.5 Wrap registration `flush()` in try/except `IntegrityError` → re-raise as `AlreadyRegisteredException` (race condition safety, same pattern as `join_group` from Story 5.2 review feedback)

### Backend — Event Router Endpoints

- [x] Task 4: Add event endpoints (AC: #1-5)
  - [x] 4.1 `GET /api/v1/community/events` — `Paginated[EventListItem]`, optional auth (`get_current_user_optional`), query params: `filter` (default `all`), `page`, `per_page`. No rate limit (read endpoint).
  - [x] 4.2 `GET /api/v1/community/events/{event_id}` — `SingleEnvelope[EventDetailResponse]`, optional auth.
  - [x] 4.3 `POST /api/v1/community/events/{event_id}/register` — `SingleEnvelope[EventRegistrationResponse]`, auth required (`get_current_user`), `rate_limit(20, 3600, "event_register")`.
  - [x] 4.4 `DELETE /api/v1/community/events/{event_id}/register` — 204 No Content, auth required, `rate_limit(20, 3600, "event_register")`.

### Backend — Event Constants and Exceptions

- [x] Task 5: Add events.py constant + exceptions (AC: #4)
  - [x] 5.1 Add `EVENT_REGISTERED_EVENT = "community.event.attendance_confirmed"` to `community/events.py` (use the same string already declared in `gamification/events.py` so the existing subscriber `on_event_attendance_confirmed` fires automatically)
  - [x] 5.2 Add `EventNotFoundException` (404), `AlreadyRegisteredException` (409), `EventAlreadyEndedException` (400) to `community/exceptions.py`
  - [x] 5.3 Register exception handlers in `app.py` if pattern requires it (check existing exception registration — community exceptions are already auto-mapped)

### Backend — Tests

- [x] Task 6: Backend tests (AC: #1-6)
  - [x] 6.1 `tests/community/test_event_repository.py` — `list_events` filters by week/month/newcomer correctly, `create_event_registration` creates row, re-register after cancel un-soft-deletes, `count_event_attendees` ignores soft-deleted, `get_user_event_registration_statuses` returns correct batch dict, `list_event_attendees` orders by created_at and respects limit
  - [x] 6.2 `tests/community/test_event_service.py` — `register_for_event` returns registered=True, increments count, emits `EVENT_REGISTERED_EVENT`. Past event raises `EventAlreadyEndedException`. Already-registered raises `AlreadyRegisteredException`. Cancel returns registered=False. `get_event_detail` includes attendees + is_registered. `list_events` with filter `newcomer_friendly` returns only flagged events.
  - [x] 6.3 `tests/community/test_event_router.py` — `GET /events` returns paginated list, supports filter query param, anonymous gets is_registered=null, authed user gets boolean. `GET /events/{id}` returns 404 for missing, includes attendees. `POST /events/{id}/register` returns 200 + registered=true, second call (without cancel) returns 409, requires auth. `DELETE /events/{id}/register` returns 204, decrements count. Rate limit kicks in after 20/hr.
  - [x] 6.4 Existing community tests remain green — adding new endpoints does not affect existing routes

### Frontend — Types and Data Fetching

- [x] Task 7: Add TypeScript types (AC: #1-4)
  - [x] 7.1 Extend `lib/types.ts` with: `EventListFilter` (`"all" | "this_week" | "this_month" | "newcomer_friendly"`), `EventListItem` (mirrors backend EventListItem), `EventAttendee`, `EventDetail`, `EventRegistrationResponse`
  - [x] 7.2 Both `EventListItem` and `EventDetail` carry `isRegistered: boolean | null`
  - [x] 7.3 Reuse `AuthorInfo`, `GroupBriefInfo`, `PaginatedResponse<T>`

- [x] Task 8: Add data fetchers in `lib/community-data.ts` (AC: #1-3)
  - [x] 8.1 `fetchEvents(filter, page, cookie?) -> { items, meta }` — calls `GET /community/events?filter=&page=&per_page=20`. Forwards Cookie header for SSR auth (same pattern as `fetchPostDetail`).
  - [x] 8.2 `fetchEventDetail(eventId, cookie?) -> EventDetail` — calls `GET /community/events/{id}`. Throws `EventNotFoundError` (or returns null) for 404 to drive `notFound()`.
  - [x] 8.3 Map snake_case → camelCase via existing pattern; mappers `mapEventListItem`, `mapEventDetail`, `mapEventAttendee`.

### Frontend — Mutation Hooks

- [x] Task 9: Create registration hooks (AC: #4-5)
  - [x] 9.1 `hooks/useRegisterEvent.ts` — TanStack `useMutation` for `POST /community/events/{eventId}/register`. Auth gate: if not authenticated → open SignupModal via `useSignupModalStore`. Optimistic: set `isRegistered=true` and `attendeeCount += 1` on `["community", "event", eventId]` cache. Reconcile on success.
  - [x] 9.2 `hooks/useCancelEventRegistration.ts` — `useMutation` for `DELETE`, optimistic toggle off + count decrement, rollback on error.
  - [x] 9.3 Wrap both into a single hook `useEventRegistration(eventId)` returning `{ register, cancel, isPending, isRegistered }` for cleaner component usage (follow `useLikePost` ergonomics).
  - [x] 9.4 Toast on success ("登録しました" / "キャンセルしました"), error toast on failure ("登録できませんでした").

### Frontend — Events List Page

- [x] Task 10: Create events list route (AC: #1-2, #6)
  - [x] 10.1 `app/(user)/[locale]/community/events/page.tsx` — Server Component. Reads `searchParams.filter` (default `all`) and `searchParams.view` (`list` | `calendar`, default `list`). Forwards Cookie header to `fetchEvents`. Pre-renders first page; client takes over for filter switching via `useQuery`.
  - [x] 10.2 `modules/community/components/EventsPageShell.tsx` (Client) — wraps children, manages segmented-control + filter-chip state via URL search params (`router.replace` with `scroll: false`).
  - [x] 10.3 `modules/community/components/EventsList.tsx` (Client) — uses `useQuery(["community", "events", filter, page], fetchEvents)` with initialData from server. Renders `EventCard` grid (1 col mobile, 2 col tablet, 3 col desktop). Empty state when `items.length === 0`.
  - [x] 10.4 `modules/community/components/EventsCalendarView.tsx` (Client) — minimal calendar grid: month view, current month, dots on dates that have events, click date → filter list to that day. **Scope:** read-only month grid (no week navigation, no recurring events). Reuses `EventCard` for selected-day events below the grid.
  - [x] 10.5 `modules/community/components/EventCard.tsx` (Client) — props: `event: EventListItem`, `locale`. Renders cover photo (or fallback gradient if null), title (max 2 lines), date/time formatted with `formatLocaleDateTime(eventDate, locale)`, 📅 + 📍 icons, attendee avatar stack (use existing avatar-stack pattern from hub), "X人参加予定" count, teal "初心者歓迎" pill badge if `isNewcomerFriendly`. Card is a `<Link href={\`/${locale}/community/events/${event.id}\`}>` wrapper.

### Frontend — Filter Chips and Segmented Control

- [x] Task 11: Filter UI controls (AC: #1)
  - [x] 11.1 `modules/community/components/EventFilterChips.tsx` (Client) — chips: `すべて`, `今週`, `今月`, `初心者歓迎`. Active chip has teal background. Updates URL `?filter=` param. Use existing `Chip` component if available in `shared/components`; otherwise inline button styled with Tailwind tokens.
  - [x] 11.2 `modules/community/components/EventsViewToggle.tsx` (Client) — SegmentedControl with `list` / `calendar` options. Use existing `SegmentedControl` from `shared/components` (check first; if absent, build minimal version). Updates URL `?view=` param.

### Frontend — Event Detail Page

- [x] Task 12: Create event detail route (AC: #3-5)
  - [x] 12.1 `app/(user)/[locale]/community/events/[event_id]/page.tsx` — Server Component. `await fetchEventDetail(eventId, cookie)`; if null → `notFound()`. Renders `EventDetailHeader`, `EventDescription`, `EventOrganizer`, `EventAttendeesList`, `RegisterEventButton` (sticky bottom on mobile).
  - [x] 12.2 `modules/community/components/EventDetailHeader.tsx` (Client) — cover photo banner (h-[200px] mobile, h-[280px] desktop), title, date/time, location with `<a href={mapUrl}>` (Google Maps link if address provided), 初心者歓迎 badge.
  - [x] 12.3 `modules/community/components/EventOrganizer.tsx` (Server) — organizer avatar + display name + senpai badge. If null, hide section.
  - [x] 12.4 `modules/community/components/EventAttendeesList.tsx` (Server) — grid of attendee avatars (max 30 visible) + "他 X人" overflow indicator if `attendeeCount > 30`.
  - [x] 12.5 `modules/community/components/RegisterEventButton.tsx` (Client) — wired to `useEventRegistration(eventId)`. States: `isRegistered=null` (guest) → "参加する" → opens SignupModal on click. `isRegistered=false` → "参加する" (teal). `isRegistered=true` → "参加中" (outlined) with secondary action "キャンセル" (smaller, links to cancel mutation with confirm dialog).

### Frontend — Confirmation Modal with Checkmark

- [x] Task 13: Registration success animation (AC: #4)
  - [x] 13.1 `modules/community/components/EventRegistrationSuccessModal.tsx` (Client) — controlled by local state in `RegisterEventButton`. Shows on successful register mutation. Renders centered checkmark SVG with scale-in animation (`transition-transform`, 300ms), title "参加登録しました 🎉", body "イベント前にリマインダーが届きます", primary action "閉じる". Auto-dismisses after 2.5s OR on click. Use existing `Modal` from `shared/components`.

### Frontend — i18n

- [x] Task 14: Add i18n keys (AC: #1-6)
  - [x] 14.1 Add to `community` namespace in `ja.json`: `events_title` ("イベント"), `view_list` ("リスト"), `view_calendar` ("カレンダー"), `filter_all` ("すべて"), `filter_this_week` ("今週"), `filter_this_month` ("今月"), `filter_newcomer_friendly` ("初心者歓迎"), `attendees_count_suffix` ("人参加予定"), `newcomer_friendly_badge` ("初心者歓迎"), `register_cta` ("参加する"), `registered_state` ("参加中"), `cancel_registration` ("キャンセル"), `cancel_confirm_title` ("登録をキャンセルしますか?"), `cancel_confirm_action` ("キャンセルする"), `cancel_confirm_dismiss` ("いいえ"), `registration_success_title` ("参加登録しました"), `registration_success_body` ("イベント前にリマインダーが届きます"), `registration_success_dismiss` ("閉じる"), `registration_error` ("登録できませんでした"), `cancel_success` ("キャンセルしました"), `empty_events_title` ("イベントはまだありません"), `empty_events_body` ("また後でチェックしてみてください"), `event_organizer_label` ("主催者"), `event_attendees_label` ("参加者"), `event_overflow_attendees` ("他 {count}人"), `event_location_label` ("場所"), `event_datetime_label` ("日時"), `event_back_to_list` ("← イベント一覧へ").
  - [x] 14.2 Add equivalent keys to `en.json` and `vi.json`. Use ICU plural where appropriate (e.g., `attendees_count`).

### Frontend — Tests

- [x] Task 15: Frontend tests (AC: #1-6)
  - [x] 15.1 `__tests__/EventCard.test.tsx` — renders title, date, location, attendee count, shows newcomer badge when `isNewcomerFriendly`, fallback gradient when `coverPhotoUrl` is null, link href is correct
  - [x] 15.2 `__tests__/EventFilterChips.test.tsx` — clicking a chip pushes correct query param, active chip has aria-pressed
  - [x] 15.3 `__tests__/EventsList.test.tsx` — shows empty state when items=[], renders cards otherwise
  - [x] 15.4 `__tests__/RegisterEventButton.test.tsx` — guest click opens SignupModal (mock store), authed click triggers register mutation, `isRegistered=true` shows "参加中" + cancel option, error path shows toast
  - [x] 15.5 `__tests__/EventRegistrationSuccessModal.test.tsx` — renders checkmark, auto-dismisses after timeout (use fake timers), dismiss button works
  - [x] 15.6 Mock `apiClient` per existing test pattern; mock `next/navigation` for router/searchParams

### Hub Integration (Sanity)

- [x] Task 16: Update community hub upcoming-events cards to link to event detail (AC: #3)
  - [x] 16.1 In `modules/community/components/CommunityHubShell.tsx` (or equivalent hub component) — wrap each upcoming-event card with `<Link href={\`/${locale}/community/events/${event.id}\`}>`. Verify hub still passes accessibility (focusable card, no nested interactive elements).
  - [x] 16.2 Add "すべて見る →" link on the upcoming-events section header pointing to `/${locale}/community/events`.

## Dev Notes

### Architecture Compliance

- **Models reuse**: `Event` and `EventRegistration` already exist in `community/models.py:161-212` from Story 5.1 schema work. Do NOT recreate. Re-use unique partial index on `(event_id, user_id) WHERE deleted_at IS NULL` for re-registration safety.
- **Toggle pattern**: Register/cancel is NOT a single-toggle endpoint (unlike PostLike). It is two separate verbs (`POST register`, `DELETE register`) — semantically clearer and matches REST. Internal flow still uses soft-delete on cancel and clears `deleted_at` on re-register.
- **Counter strategy**: There is no `attendee_count` column on `events` table — counts are derived via correlated subquery (already used in `repo.upcoming_events`). Do NOT add a denormalized counter column; the subquery is acceptable at current scale and simpler.
- **Event bus**: Reuse the existing string `"community.event.attendance_confirmed"` (already declared in `gamification/events.py:20`). Add a community-side constant alias `EVENT_REGISTERED_EVENT` pointing to the same string so the gamification subscriber `on_event_attendance_confirmed` (events.py:159) fires automatically with payload `{user_id, event_id, attendance_id}`.
- **Notification reminders**: AC #4 says "triggers notification reminder" — full reminder scheduling is OUT OF SCOPE for this story. Just emit the event; notification subscription / scheduled reminder job is deferred (likely Story 7.3 or epic-7 scope already covers `EVENT_UPDATED_EVENT`). Document in completion notes.
- **Module isolation**: All event endpoints belong to `community` module. Do NOT create a separate `events` module. Group/Post/Event/Comment all live together.
- **Response format**: Lists use `Paginated[T]`, single resources use `SingleEnvelope[T]` from `modules.listing.schemas` (project-wide convention).
- **Optional auth**: Read endpoints (`GET /events`, `GET /events/{id}`) accept `get_current_user_optional` so anonymous users see the page in read-only mode (FR20-style policy).
- **Rate limiting**: `event_register` 20/hr (lower than likes since registrations are deliberate).
- **Past events**: List endpoint filters `event_date >= now()` — past events are not shown anywhere.
- **Time zone**: `event_date` is stored as `DateTime(timezone=True)` (UTC). Frontend formats per locale via `formatLocaleDateTime` utility.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| Event model | `backend/modules/community/models.py:161-189` | Already has group_id, title, description, cover_photo_url, event_date, location, organizer_id, is_newcomer_friendly |
| EventRegistration model | `backend/modules/community/models.py:191-212` | Already has unique partial index on (event_id, user_id) |
| `repo.upcoming_events(limit=5)` | `community/repository.py:455-484` | Reuse subquery pattern for `list_events`; do NOT duplicate |
| `repo.get_attendee_avatars(event_ids)` | `community/repository.py:486-512` | Reuse for batch avatar resolution in list endpoint |
| `UpcomingEventItem` schema | `community/schemas.py:66-76` | Reference; new `EventListItem` is similar but adds `is_registered` |
| Hub upcoming-events section | hub page already renders top-5 — link out to new events route |
| `COMMUNITY_EVENT_ATTENDANCE_CONFIRMED_EVENT` | `gamification/events.py:20` | Reuse string constant — gamification subscriber `on_event_attendance_confirmed` already wired |
| Gamification ActionType.EVENT_ATTENDANCE | `gamification/constants.py:12` | Already mapped — registering an event awards points automatically |
| `get_current_user_optional`, `get_current_user` | `modules/auth/dependencies.py` | Standard auth deps |
| `Paginated`, `SingleEnvelope` | `modules/listing/schemas.py` | Response wrappers |
| `rate_limit(limit, window_s, route_key)` | `shared/rate_limit.py` | Apply to register/cancel |
| `useSignupModalStore` | `shared/stores/useSignupModalStore.ts` | Auth gate trigger |
| `apiClient`, `useToast`, `useAuthStore` | shared lib/hooks | Standard |
| `Modal`, `SegmentedControl`, `Chip`, `Skeleton` | `shared/components/` | **Verify presence first** — if `SegmentedControl` or `Chip` are missing, build minimal inline versions rather than blocking |
| `formatLocaleDateTime` | `shared/lib/dates.ts` (or similar) | Verify path; if not present use `Intl.DateTimeFormat` with locale |
| Community i18n namespace | `apps/web/messages/{ja,en,vi}.json` → `community` | Extend, do NOT create new namespace |
| `useLikePost` (reference pattern) | `apps/web/modules/community/hooks/useLikePost.ts` | Mirror auth-gate + optimistic update structure for `useEventRegistration` |
| BFF proxy | `apps/web/app/api/(user)/[...path]/route.ts` | All `/community/*` calls already proxied — no new BFF routes needed |
| `EventRegistration` table indexes | unique partial idx on (event_id, user_id) | Race-condition-safe re-registration; no new migration needed |

### API Design

```
GET /api/v1/community/events
  Auth: optional
  Query: filter (all|this_week|this_month|newcomer_friendly, default=all),
         page (default=1, ge=1), per_page (default=20, ge=1, le=50)
  Response: Paginated[EventListItem]
  Notes: Always upcoming only (event_date >= now). Order by event_date ASC.

GET /api/v1/community/events/{event_id}
  Auth: optional
  Response: SingleEnvelope[EventDetailResponse]
  404 if event missing or soft-deleted.

POST /api/v1/community/events/{event_id}/register
  Auth: required
  Rate limit: 20/hr (route_key=event_register)
  Response: SingleEnvelope[EventRegistrationResponse] { registered: true, attendee_count: N }
  Errors: 404 EventNotFoundException, 409 AlreadyRegisteredException, 400 EventAlreadyEndedException

DELETE /api/v1/community/events/{event_id}/register
  Auth: required
  Rate limit: 20/hr (shared bucket with POST)
  Response: 204 No Content
  Errors: 404 EventNotFoundException (event missing or registration not found)
```

### Frontend Route Structure

```
app/(user)/[locale]/community/events/
  page.tsx                          (Server) — list view, reads ?filter, ?view
  [event_id]/
    page.tsx                        (Server) — detail view, fetchEventDetail or notFound()
```

### Frontend Component Tree

```
events/page.tsx (Server)
└── EventsPageShell (Client)
    ├── EventsViewToggle (Client) — list/calendar segmented
    ├── EventFilterChips (Client) — all/week/month/newcomer
    ├── EventsList (Client, view=list)
    │   └── EventCard × N
    └── EventsCalendarView (Client, view=calendar)
        └── EventCard × N (selected-day events)

events/[event_id]/page.tsx (Server)
├── EventDetailHeader (Client)
├── EventDescription (Server)
├── EventOrganizer (Server)
├── EventAttendeesList (Server)
└── RegisterEventButton (Client)
    └── EventRegistrationSuccessModal (Client)
```

### Filter Date Math (Backend)

```python
# repository.list_events
now = datetime.now(UTC)

base_filters = [
    Event.deleted_at.is_(None),
    Event.event_date >= now,
]

if filter == "this_week":
    week_end = now + timedelta(days=7)
    base_filters.append(Event.event_date < week_end)
elif filter == "this_month":
    # End of current month (next month's 1st 00:00 UTC)
    if now.month == 12:
        month_end = datetime(now.year + 1, 1, 1, tzinfo=UTC)
    else:
        month_end = datetime(now.year, now.month + 1, 1, tzinfo=UTC)
    base_filters.append(Event.event_date < month_end)
elif filter == "newcomer_friendly":
    base_filters.append(Event.is_newcomer_friendly.is_(True))
# "all" → no extra filter
```

### Register/Cancel Service Pattern

```python
async def register_for_event(self, user_id: UUID, event_id: UUID) -> EventRegistrationResponse:
    event = await self.repo.get_event_by_id(event_id)
    if not event:
        raise EventNotFoundException(event_id)
    if event.event_date < datetime.now(UTC):
        raise EventAlreadyEndedException(event_id)

    existing = await self.repo.find_event_registration(event_id, user_id)
    if existing and existing.deleted_at is None:
        raise AlreadyRegisteredException(event_id)
    if existing and existing.deleted_at is not None:
        existing.deleted_at = None
        existing.updated_at = datetime.now(UTC)
        attendance_id = existing.id
    else:
        try:
            new_reg = await self.repo.create_event_registration(event_id, user_id)
            await self.session.flush()  # surfaces unique-violation early
            attendance_id = new_reg.id
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyRegisteredException(event_id) from exc

    await self.session.commit()
    count = await self.repo.count_event_attendees(event_id)

    await emit(EVENT_REGISTERED_EVENT, {
        "user_id": str(user_id),
        "event_id": str(event_id),
        "attendance_id": str(attendance_id),
    })

    return EventRegistrationResponse(registered=True, attendee_count=count)
```

### Frontend Optimistic Register Pattern (mirror useLikePost)

```typescript
// hooks/useEventRegistration.ts
export function useEventRegistration(eventId: string) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openSignupModal = useSignupModalStore((s) => s.open);

  const registerMutation = useMutation({
    mutationFn: () =>
      apiClient<{ data: EventRegistrationResponse }>(
        `/community/events/${eventId}/register`,
        { method: "POST" },
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["community", "event", eventId] });
      const prev = queryClient.getQueryData(["community", "event", eventId]);
      queryClient.setQueryData(["community", "event", eventId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          isRegistered: true,
          attendeeCount: old.data.attendeeCount + 1,
        },
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(["community", "event", eventId], ctx?.prev);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      apiClient(`/community/events/${eventId}/register`, { method: "DELETE" }),
    onMutate: async () => {
      const prev = queryClient.getQueryData(["community", "event", eventId]);
      queryClient.setQueryData(["community", "event", eventId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          isRegistered: false,
          attendeeCount: Math.max(old.data.attendeeCount - 1, 0),
        },
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(["community", "event", eventId], ctx?.prev);
    },
  });

  function register() {
    if (!isAuthenticated) { openSignupModal(); return; }
    registerMutation.mutate();
  }
  function cancel() {
    if (!isAuthenticated) return;
    cancelMutation.mutate();
  }

  return {
    register,
    cancel,
    isPending: registerMutation.isPending || cancelMutation.isPending,
  };
}
```

### TanStack Query Key Convention

```typescript
["community", "events", filter, page]    // events list, paginated, per filter
["community", "event", eventId]          // single event detail
// Existing (unchanged)
["community", "hub"], ["community", "post", postId], ...
```

### i18n Notes

- Use `t("community.events_title")` etc. via `useTranslations("community")`.
- For ICU plural on attendee count, prefer `t("attendees_count", { count })` with messages like `"{count, plural, other {#人参加予定}}"` (Japanese has no plural distinction; English and Vietnamese also collapse — single ICU pattern works).
- Pass i18n template strings to client via `t.raw()` if needed (per project memory: ICU variables in client components must use `t.raw()`).

### Anti-Patterns to Avoid

- Do NOT add denormalized `events.attendee_count` column — derive via subquery.
- Do NOT create a single-toggle endpoint for register/cancel — REST verbs are clearer (POST register / DELETE register).
- Do NOT create a separate `events` module — events live in `community/`.
- Do NOT add WebSocket / real-time attendee updates — TanStack `invalidateQueries` after mutation suffices.
- Do NOT add reminder scheduling logic in this story — emit the event, leave reminder delivery to notification module (deferred).
- Do NOT block past events from showing on detail page if the user has the URL — only filter past events out of the LIST. (Detail page should still render past events to support shareable links / history.) BUT the register button must check `event_date >= now` server-side.
- Do NOT show a register button on past events — render "イベントは終了しました" disabled state instead.
- Do NOT use spinners — use `Skeleton`.
- Do NOT use relative imports in frontend — always `@/` aliases.
- Do NOT use `any` type — use `unknown` + type guards.
- Do NOT hard-code Japanese text — all strings via `useTranslations("community")`.
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`.
- Do NOT create separate BFF route files — reuse `app/api/(user)/[...path]/route.ts`.
- Do NOT add photo upload for events in this story — display existing `cover_photo_url` only.
- Do NOT add event creation flow in this story — admin/seed creates events; user creation is out of scope.
- Do NOT modify the `Event` or `EventRegistration` table schema — they are sufficient. No new migration required.

### Previous Story Intelligence (Story 5-3)

- **Agent model**: claude-opus-4-6
- **Pattern established**: optimistic mutation with auth gate (`useLikePost`/`useLikeComment`) — mirror exactly for `useEventRegistration`.
- **Integrity-error wrapping**: `try/except IntegrityError → custom 409 exception` — apply to `create_event_registration`.
- **Test baselines after 5-3**: Backend 461 tests, Frontend 455 tests (3 pre-existing Gallery.test.tsx failures unchanged). Maintain + add new tests.
- **Server → Client conversion** for interactive headers (ThreadHeader pattern) — apply to `EventDetailHeader` since register button must be client-side.
- **i18n keys for ja/en/vi** added consistently — follow the same trio approach for events keys.

### Git Intelligence

Recent commits:
- `fb4b5e5 create: add post and comment like feature for community thread detail`
- `0486ff6 create: add story 5-3 community thread detail and update homepage UI layout`
- `570b20c create: add join groups, create posts, and comments for community feature (story 5-2)`
- `6ca5df1 create: add community hub feature with group browsing and updates to listings`

Commit convention: `create: ...` for new features. This story → `create: add event browsing and registration for community (story 5-4)`.

### Project Structure Notes

**New files to create:**

```
backend/tests/community/test_event_repository.py
backend/tests/community/test_event_service.py
backend/tests/community/test_event_router.py

apps/web/app/(user)/[locale]/community/events/page.tsx
apps/web/app/(user)/[locale]/community/events/[event_id]/page.tsx
apps/web/modules/community/components/EventsPageShell.tsx
apps/web/modules/community/components/EventsList.tsx
apps/web/modules/community/components/EventsCalendarView.tsx
apps/web/modules/community/components/EventCard.tsx
apps/web/modules/community/components/EventFilterChips.tsx
apps/web/modules/community/components/EventsViewToggle.tsx
apps/web/modules/community/components/EventDetailHeader.tsx
apps/web/modules/community/components/EventOrganizer.tsx
apps/web/modules/community/components/EventAttendeesList.tsx
apps/web/modules/community/components/RegisterEventButton.tsx
apps/web/modules/community/components/EventRegistrationSuccessModal.tsx
apps/web/modules/community/hooks/useEventRegistration.ts
apps/web/modules/community/__tests__/EventCard.test.tsx
apps/web/modules/community/__tests__/EventFilterChips.test.tsx
apps/web/modules/community/__tests__/EventsList.test.tsx
apps/web/modules/community/__tests__/RegisterEventButton.test.tsx
apps/web/modules/community/__tests__/EventRegistrationSuccessModal.test.tsx
```

**Files to modify:**

```
backend/modules/community/schemas.py            — add EventListItem, EventDetailResponse, EventAttendee, EventRegistrationResponse, EventListFilter
backend/modules/community/repository.py         — add list_events, get_event_by_id, list_event_attendees, find/create/soft_delete_event_registration, count_event_attendees, get_user_event_registration_status(es)
backend/modules/community/service.py            — add list_events, get_event_detail, register_for_event, cancel_event_registration
backend/modules/community/router.py             — add 4 endpoints (GET list, GET detail, POST register, DELETE register)
backend/modules/community/events.py             — add EVENT_REGISTERED_EVENT alias
backend/modules/community/exceptions.py         — add EventNotFoundException, AlreadyRegisteredException, EventAlreadyEndedException
apps/web/modules/community/lib/types.ts         — add EventListItem, EventDetail, EventAttendee, EventListFilter, EventRegistrationResponse
apps/web/modules/community/lib/community-data.ts — add fetchEvents, fetchEventDetail
apps/web/modules/community/components/CommunityHubShell.tsx  — link upcoming-event cards + section "すべて見る →"
apps/web/messages/ja.json                       — add events i18n keys
apps/web/messages/en.json                       — add events i18n keys
apps/web/messages/vi.json                       — add events i18n keys
```

**No new migration required** — `events` and `event_registrations` tables already exist from Story 5.1.

### Validation Gates

Before marking complete, verify ALL pass:

```bash
python -m ruff check backend/                         # Backend lint
python -m pytest backend/tests/                       # All backend tests
pnpm --filter web test                                # All frontend tests
pnpm --filter web lint                                # Frontend lint
pnpm --filter web build                               # Next.js build
```

### References

- [Source: epics/epic-5-community-events.md#Story 5.4] — acceptance criteria and user story
- [Source: prd/functional-requirements.md#FR23-FR25] — events functional requirements
- [Source: prd/functional-requirements.md#FR12] — event_attendance contributes to gamification
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — backend module structure
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns] — naming conventions
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — Paginated/SingleEnvelope wrappers
- [Source: architecture/core-architectural-decisions.md#API Communication Patterns] — REST conventions
- [Source: backend/modules/community/models.py:161-212] — Event, EventRegistration models (already exist)
- [Source: backend/modules/community/repository.py:455-512] — upcoming_events, get_attendee_avatars (reuse)
- [Source: backend/modules/community/schemas.py:66-76] — UpcomingEventItem (reference for EventListItem)
- [Source: backend/modules/community/router.py] — existing community endpoints + rate_limit usage
- [Source: backend/modules/community/events.py] — POST_CREATED_EVENT, POST_LIKED_EVENT (pattern)
- [Source: backend/modules/community/exceptions.py] — existing AppException subclasses
- [Source: backend/modules/gamification/events.py:20,159-165,178-181] — COMMUNITY_EVENT_ATTENDANCE_CONFIRMED_EVENT and on_event_attendance_confirmed subscriber (already wired)
- [Source: backend/modules/gamification/constants.py:12] — ActionType.EVENT_ATTENDANCE
- [Source: apps/web/modules/community/hooks/useLikePost.ts] — optimistic mutation + auth gate pattern
- [Source: apps/web/modules/community/components/ThreadHeader.tsx] — Server→Client interactive header pattern
- [Source: apps/web/modules/community/components/CommentList.tsx] — paginated client list pattern
- [Source: apps/web/modules/community/lib/community-data.ts] — fetcher pattern with cookie forwarding
- [Source: apps/web/modules/community/lib/types.ts:26-35] — UpcomingEventItem type (reference)
- [Source: apps/web/messages/ja.json#community] — existing community namespace to extend
- [Source: shared/stores/useSignupModalStore.ts] — auth gate trigger
- [Source: shared/rate_limit.py] — rate_limit(limit, window_s, route_key)
- [Source: shared/events.py] — emit/subscribe API
- [Source: _bmad-output/implementation-artifacts/5-3-community-thread-detail.md] — previous story intelligence + patterns

## Dev Agent Record

### Agent Model Used

claude-opus-4-7 (1M context)

### Debug Log References

- Frontend lint flagged `Date.now()` impurity inside render and `setState` in effect for `RegisterEventButton`; resolved by deferring `isPast` computation into a mount-only effect (with `react-hooks/set-state-in-effect` disable comment, mirroring acceptable pattern for time-derived state).
- Pre-existing 3 Gallery.test.tsx failures remain unchanged (carried over from Story 5.3 baseline).

### Completion Notes List

- ✅ AC #1-6 all satisfied. Backend (events module) extended in-place (no new module): schemas, repo, service, router, events.py constant alias, exceptions.
- ✅ Re-used `Event` and `EventRegistration` models from Story 5.1 — no migration required.
- ✅ Reused gamification subscriber by aliasing `EVENT_REGISTERED_EVENT = "community.event.attendance_confirmed"`; `on_event_attendance_confirmed` fires automatically and awards `ActionType.EVENT_ATTENDANCE` points.
- ✅ Soft-delete-aware re-registration (mirrors `join_group` pattern): `IntegrityError` on race wrapped into `AlreadyRegisteredException` (409).
- ✅ Past events filtered out of list endpoint; detail page still renders past events but the register button shows disabled "イベントは終了しました" state.
- ✅ Notification reminder scheduling intentionally deferred (per story Dev Notes) — only the bus event is emitted in this story; reminder delivery owned by Epic 7 / Story 7.3.
- ✅ Frontend list uses TanStack Query with SSR initialData; calendar view is a read-only month grid that filters into the same EventCard component.
- ✅ Optimistic register/cancel mutations mirror `useLikePost`. Auth gate opens SignupModal via `useSignupModalStore`.
- ✅ Hub upcoming-events cards now link to `/${locale}/community/events/${id}` and the "すべて見る →" button targets the new events page.
- ✅ i18n: added 30+ keys to `community` namespace in `ja.json`, `en.json`, `vi.json`. The previous `events_title` ("今週のイベント") was renamed to `upcoming_events_title` to free `events_title` for the page-level "イベント" label per spec.
- ✅ Tests: backend 503 passing (42 new), frontend 474 passing (19 new event-related). Three Gallery.test.tsx failures pre-existed and are unchanged.
- ⚠️ Out-of-scope deferred: event creation flow (admin/seed-only for now), reminder scheduling, photo upload for events, real-time attendee updates.

### File List

**Backend — modified**

- backend/modules/community/schemas.py
- backend/modules/community/events.py
- backend/modules/community/exceptions.py
- backend/modules/community/repository.py
- backend/modules/community/service.py
- backend/modules/community/router.py

**Backend — new**

- backend/tests/community/test_event_repository.py
- backend/tests/community/test_event_service.py
- backend/tests/community/test_event_router.py

**Frontend — modified**

- apps/web/modules/community/lib/types.ts
- apps/web/modules/community/lib/community-data.ts
- apps/web/modules/community/components/UpcomingEventsSection.tsx
- apps/web/app/(user)/[locale]/community/page.tsx
- apps/web/messages/ja.json
- apps/web/messages/en.json
- apps/web/messages/vi.json

**Frontend — new**

- apps/web/app/(user)/[locale]/community/events/page.tsx
- apps/web/app/(user)/[locale]/community/events/[event_id]/page.tsx
- apps/web/modules/community/hooks/useEventRegistration.ts
- apps/web/modules/community/components/EventCard.tsx
- apps/web/modules/community/components/EventFilterChips.tsx
- apps/web/modules/community/components/EventsViewToggle.tsx
- apps/web/modules/community/components/EventsList.tsx
- apps/web/modules/community/components/EventsCalendarView.tsx
- apps/web/modules/community/components/EventsPageShell.tsx
- apps/web/modules/community/components/EventDetailHeader.tsx
- apps/web/modules/community/components/EventOrganizer.tsx
- apps/web/modules/community/components/EventAttendeesList.tsx
- apps/web/modules/community/components/RegisterEventButton.tsx
- apps/web/modules/community/components/EventRegistrationSuccessModal.tsx
- apps/web/modules/community/__tests__/EventCard.test.tsx
- apps/web/modules/community/__tests__/EventFilterChips.test.tsx
- apps/web/modules/community/__tests__/EventsList.test.tsx
- apps/web/modules/community/__tests__/RegisterEventButton.test.tsx
- apps/web/modules/community/__tests__/EventRegistrationSuccessModal.test.tsx

### Change Log

- 2026-04-27 — Story 5.4 implemented end-to-end (backend events API + frontend events list/detail/calendar/registration). Reused existing Event/EventRegistration tables; aliased `EVENT_REGISTERED_EVENT` to chain into existing gamification subscriber. Hub upcoming-events cards now link into the new events route.
