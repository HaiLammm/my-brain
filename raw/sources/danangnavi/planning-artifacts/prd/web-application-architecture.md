# Web Application Architecture

## Technical Overview

DaNangNavi is a hybrid Next.js web application — SSR for public-facing pages (SEO-critical for Japanese search traffic) and SPA behavior for authenticated dashboards. FastAPI backend serves REST API for all three client interfaces.

## Browser Support

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest 2 | Primary |
| Safari | Latest 2 | Primary |
| Edge | Latest 2 | Primary |
| Mobile Chrome (Android) | Latest 2 | Primary |
| Mobile Safari (iOS) | Latest 2 | Primary |
| Firefox | Not targeted but should work | Secondary |

## Responsive Design

- End User App: mobile-first responsive (320-767px primary)
- Business Owner Dashboard: desktop-first, mobile-acceptable (1024px+)
- Admin Panel: desktop-only acceptable for MVP (1024px+)

## SEO Strategy

- SSR for all public pages: homepage, listing detail, area guides, community posts
- Japanese-language meta tags, structured data (JSON-LD) for listings
- URL structure: `/ja/listing/{slug}`, `/ja/area/{area-name}`, `/ja/community/{group-slug}`
- Sitemap generation + OpenGraph tags for social sharing (LINE, Twitter)
- Target keywords: "ダナン レストラン", "ダナン 日本人", "ダナン 生活ガイド"

## Real-Time Strategy

| Feature | Approach | Interval |
|---------|----------|----------|
| Community feed updates | Polling | 30s |
| Notification badge count | Polling | 60s |
| Admin moderation queue | Polling | 30s |
| Business dashboard analytics | Polling | 5min |
| Chat/messaging | Polling for MVP, WebSocket for Growth | 10s |

## Implementation Stack

**Next.js:** App Router, server components for SSR, client components for interactivity, BFF layer proxying to FastAPI, Image component for photo optimization.

**FastAPI:** RESTful API with versioning (`/api/v1/`), PostgreSQL database, Redis caching, background tasks for auto-translation/image moderation/spam detection.

**Authentication:** JWT in HTTP-only cookies with refresh token rotation. Four roles: Guest (default), User, BusinessOwner, Admin (RBAC sub-roles). Social login (LINE, Google) for Users. Email/password for BusinessOwners and Admin. Guest accesses public content; registration required for save/favorite/review/community.
