# Logical View Map: Scenario 01 — Naoki's First Week

**Created:** 2026-04-08
**Status:** Confirmed

---

## Logical Views

### V1: Homepage (01.1)

| Field | Value |
|-------|-------|
| Spec | `01.1-homepage/01.1-homepage.md` |
| Route | `/` |
| States | First visit (welcome banner visible), Returning visit (banner dismissed) |
| Sections | Hero+Search, Welcome Banner, Senpai Picks, Deals, Community, Categories |
| Shared Components | TopNavBar, SearchBar, SenpaiCard, DealCard, SectionHeader |

### V2: Newcomer Onboarding (01.2)

| Field | Value |
|-------|-------|
| Spec | `01.2-newcomer-onboarding/01.2-newcomer-onboarding.md` |
| Route | `/onboarding` |
| States | Step 1 (reason), Step 2 (urgency), Step 3 (workplace), Checklist generated |
| Sections | Welcome Header, 3-Step Wizard, Generated Checklist, Senpai Tip, Save CTA |
| Shared Components | SenpaiCard |

### V3: Area Guide (01.3)

| Field | Value |
|-------|-------|
| Spec | `01.3-area-neighborhood-guide/01.3-area-neighborhood-guide.md` |
| Route | `/areas` and `/areas/[slug]` |
| States | Index view (all areas), Detail view (single area expanded) |
| Sections | Overview Header+Map, Comparison Cards, Area Detail, Senpai Stories |
| Shared Components | SenpaiCard, DualCurrencyPrice |

### V4: Search/Browse (01.4)

| Field | Value |
|-------|-------|
| Spec | `01.4-search-browse/01.4-search-browse.md` |
| Route | `/search` |
| States | List view, Map view, Empty state, Filtered |
| Sections | Search Header+Filters, Results Grid, Map Toggle, Filter Panel, Empty State |
| Shared Components | SearchBar, ListingCard, FairPriceIndicator, SenpaiVerifiedBadge, DualCurrencyPrice |

### V5: Listing Detail (01.5)

| Field | Value |
|-------|-------|
| Spec | `01.5-listing-detail/01.5-listing-detail.md` |
| Route | `/listings/[id]` |
| States | Default, Contact modal, Photo fullscreen |
| Sections | Photo Gallery, Header+Price, Key Details, Amenities, Reviews, Contract Guide, Map, Action Bar |
| Shared Components | FairPriceIndicator, SenpaiVerifiedBadge, DualCurrencyPrice, SenpaiCard |

---

## Build Order

| Order | View | Rationale |
|-------|------|-----------|
| 1 | V1: Homepage | Foundation — creates shared components (nav, search, cards) |
| 2 | V4: Search/Browse | Reuses SearchBar, ListingCard from Homepage |
| 3 | V5: Listing Detail | Reuses DualCurrencyPrice, SenpaiVerifiedBadge |
| 4 | V3: Area Guide | Reuses card pattern, adds map interaction |
| 5 | V2: Newcomer Onboarding | Standalone wizard, minimal shared dependencies |

---

## Shared Component Registry

| Component | V1 | V2 | V3 | V4 | V5 | Created In |
|-----------|----|----|----|----|----|----|
| TopNavBar | x | x | x | x | x | V1 |
| SearchBar | x | | | x | | V1 |
| SenpaiCard | x | x | x | | x | V1 |
| DealCard | x | | | | | V1 |
| SectionHeader | x | x | x | x | x | V1 |
| ListingCard | | | | x | | V4 |
| FairPriceIndicator | | | | x | x | V4 |
| SenpaiVerifiedBadge | | | | x | x | V4 |
| DualCurrencyPrice | | | x | x | x | V3 or V4 |
