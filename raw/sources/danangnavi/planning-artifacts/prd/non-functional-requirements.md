# Non-Functional Requirements

## Performance

| Metric | Requirement | Context |
|--------|-------------|---------|
| Page Load (SSR) | FCP < 2s, LCP < 2.5s | Public pages — SEO ranking + user retention |
| Time to Interactive | TTI < 3s | Critical for mobile users on 4G |
| API Response | < 500ms (p95) | All REST endpoints under normal load |
| Search Response | < 1s including cross-language matching | FR65 cross-language search JP↔VN |
| Image Delivery | < 1s for optimized photos | Camera-only photos via CDN |
| Layout Stability | CLS < 0.1 | Core Web Vitals compliance |
| Peak Concurrent Users | 500-1,000 simultaneous | Peak hours: 11-13h and 17-19h |
| Polling Overhead | < 5% CPU increase per 1,000 connected clients | Community feed + notification polling |

## Security

| Requirement | Detail |
|-------------|--------|
| Authentication | JWT in HTTP-only cookies, refresh token rotation, CSRF protection |
| Data Encryption | TLS 1.3 for transit, AES-256 for data at rest |
| Password Storage | bcrypt with salt for BusinessOwner/Admin passwords |
| Session Management | Automatic session expiry (24h User, 8h Admin), forced logout on password change |
| Input Validation | Server-side validation on all endpoints, parameterized queries (SQL injection prevention) |
| File Upload Security | EXIF validation + file type verification + size limits (max 10MB/photo) + malware scan |
| Rate Limiting | API rate limits: 100 req/min Guest, 300 req/min User, 500 req/min BusinessOwner |
| RBAC Enforcement | Role checks on every API endpoint, no client-side-only authorization |
| Audit Logging | All admin actions logged with timestamp, actor, and action detail |
| APPI Compliance | Japanese user data: explicit consent, right to deletion (FR74), data export capability |
| Vietnam Cybersecurity Law | All data stored on Vietnam-based servers (FR57) |

## Scalability

| Scenario | Requirement |
|----------|-------------|
| Month 1 | 5,000 daily visits, 50 businesses, 500 concurrent peak |
| Month 6 | 50,000 daily visits, 300 businesses, 5,000 concurrent peak |
| Database Growth | Support 100K+ listings, 500K+ reviews, 1M+ activity logs without degradation |
| Image Storage | Support 500K+ photos with CDN delivery |
| Horizontal Scaling | Stateless API design allowing additional FastAPI instances behind load balancer |
| Cache Strategy | Redis cache with 80%+ hit rate for listing data and search results |
| Database Scaling | Read replicas for analytics queries, connection pooling for concurrent access |
| Graceful Degradation | Under extreme load: serve cached content, queue non-critical writes |

## Accessibility

| Requirement | Detail |
|-------------|--------|
| Standard | WCAG 2.1 AA compliance |
| Font Size | Minimum 16px body text, scalable up to 200% |
| Touch Targets | Minimum 44x44px for all interactive elements |
| Color Contrast | 4.5:1 minimum for normal text, 3:1 for large text |
| Alt Text | Required for all listing images and user-uploaded photos |
| Keyboard Navigation | Full keyboard support for Admin Panel (desktop) |
| Screen Reader | Semantic HTML with ARIA labels for key interactions |
| Language Attributes | `lang="ja"` on Japanese content, `lang="vi"` on Vietnamese |
| Motion | Respect `prefers-reduced-motion` for animations |

## Integration

| Service | Purpose | Criticality | Fallback |
|---------|---------|-------------|----------|
| Google/DeepL Translation API | Auto-translate VN→JP for listings | High | Queue for manual translation |
| LINE Login | Primary social auth for Japanese users | High | Google login as alternative |
| Google OAuth | Secondary social auth | Medium | Email/password registration |
| Google Maps API | Map display + navigation links | Medium | Static map image + address text |
| Payment Gateway (VNPay/Momo) | Business owner ad payments, coupon commissions | Medium (post-MVP) | Bank transfer + cash |
| Email Service (SendGrid/SES) | Transactional emails | High | Queue and retry |
| SMS Service (Twilio/local) | OTP verification, critical notifications | Medium | Email fallback |
| Zalo Bot API | Communication bridge for Vietnamese business owners | Medium | In-app notification fallback |
| CDN (Cloudflare/CloudFront) | Image and static asset delivery | High | Direct server delivery |

**Integration Resilience:** All external API calls with 5s timeout and circuit breaker pattern. Failed integrations must not block core user flows. Integration health monitoring on Admin dashboard.

## Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% (max 1.8 days downtime/year) |
| Data Backup | Daily automated backup with 30-day retention |
| Backup Recovery | Restore within 4 hours (RTO) |
| Data Loss Tolerance | Maximum 24 hours (RPO = daily backup) |
| Error Rate | < 0.1% server errors (5xx) under normal load |
| Monitoring | Alerts for: downtime, error spike, high latency, disk/memory thresholds |
| Incident Response | Alert → Acknowledge < 30min during business hours |
| Database | PostgreSQL with daily pg_dump, transaction logging for point-in-time recovery |
