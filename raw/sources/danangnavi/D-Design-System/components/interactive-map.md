# Interactive Map

**Component ID:** `interactive-map`
**Category:** Display — Map
**Complexity:** Complex
**Used on:** 01.2 Onboarding, 01.3 Area Guide, 01.4 Search, 01.5 Listing Detail, 02.3 Events (5 pages)

---

## Purpose

Embedded map component used across multiple contexts — area selection, search results, listing location, and event venues. Adapts its behavior and overlays based on the page context.

---

## Variants

| Variant | Context | Behavior |
|---------|---------|----------|
| `zone-selector` | 01.2 Onboarding, 01.3 Area Guide | Colored zone regions, tap to select area |
| `search-results` | 01.4 Search | Price pins, tap for card preview overlay |
| `location-detail` | 01.5 Listing Detail, 02.3 Events | Single pin with nearby amenity markers |
| `mini` | 02.3 Event Detail | Small thumbnail, tap opens full map or native app |

---

## Properties — Container

| Property | Value |
|----------|-------|
| Border radius | `radius-md` (12px) |
| Shadow | `shadow-card` |
| Overflow | Hidden (clips map to rounded corners) |
| Min height | 200px (mini), 300px (default), 50vh (fullscreen toggle) |

---

## Variant: `zone-selector`

| Property | Value |
|----------|-------|
| Zones | Colored polygons per Da Nang district |
| Zone colors | Pastel fills with darker borders |
| Active zone | Highlighted with `color-accent` (#2EC4B6) border, 20% fill |
| Labels | District name centered in each zone |
| Fallback | Scrollable list for accessibility |

### Interactions
- Tap zone → select area, show area info card
- Pinch zoom supported
- Workplace marker (⭐) shown if user has set workplace

---

## Variant: `search-results`

| Property | Value |
|----------|-------|
| Pins | Navy circle (#1B2A4A) with white price text |
| Pin format | Compact price: "¥48K" |
| Pin size | 36px diameter |
| Active pin | Scale 1.2x + `shadow-card-hover` |
| Preview card | 200px wide card overlay anchored to pin |

### Interactions
- Tap pin → show listing preview card overlay
- Tap preview → navigate to listing detail
- Drag to pan, pinch to zoom
- Workplace marker (⭐) always visible
- Clusters when zoomed out (number badge)

---

## Variant: `location-detail`

| Property | Value |
|----------|-------|
| Center pin | `color-secondary` (#FF6B4A) drop pin |
| Amenity markers | Small gray dots with category icons |
| Radius circle | Optional 500m/1km walking radius |
| Commute line | Dashed line from listing to workplace marker |

### Interactions
- Tap amenity marker → show name tooltip
- Tap "Open in Maps" → native maps app
- Static by default, interactive on tap

---

## Variant: `mini`

| Property | Value |
|----------|-------|
| Height | 120px |
| Width | Full-width or 200px in side panel |
| Interactive | No — static thumbnail |
| Overlay | "地図で見る →" link overlay |

### Interactions
- Tap → open full map or native maps app

---

## Data Dependencies

- Map tiles: Mapbox or Google Maps
- Geocoding: Address → coordinates
- Workplace location: Stored in user profile/localStorage
- Commute calculation: Walking/driving time API

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, height adapts per variant |
| Desktop (search) | Side panel (40% width) alongside list |
| Desktop (detail) | Inline within content, max-height 400px |

---

**Last Updated:** 2026-04-08
