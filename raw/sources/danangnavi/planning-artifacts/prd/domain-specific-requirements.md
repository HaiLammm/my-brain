# Domain-Specific Requirements

## Privacy & Data Protection

**Data Collection Scope:**
- User activity logs: clicks, likes, search queries by topic, browsing history
- Location data: GPS when app is active, location history stored for personalization
- Contribution data: reviews, photos, comments, community posts
- Business owner data: listing content, analytics access, financial transactions

**Storage & Compliance:**
- All data stored on Vietnam-based servers (Vietnam Cybersecurity Law 2018)
- APPI (Japan) considerations for Japanese user personal data — explicit consent required
- Clear privacy policy in both Japanese and Vietnamese
- Consent flow mandatory at registration — granular opt-in for location tracking and activity logging

**Location Privacy:**
- GPS collected only when app is actively open (not background tracking)
- Location history stored for personalized recommendations
- Users can disable location for non-location features (community, profile)
- Location data retention policy: define maximum storage period

## Content Moderation & Liability

**Moderation Framework:**
- Platform assumes moderation responsibility through Admin team
- Three separate Terms of Service: End User, Business Owner, Admin Staff
- Camera-only photo policy enforced at upload (EXIF metadata validation)

**Fake Review Dispute Process:**
1. Business owner files complaint through Business Dashboard
2. Admin team dispatched for on-site verification
3. Investigation and confirmation of findings
4. If confirmed fake: compensation to business owner + permanent account ban for violator
5. Resolution timeline: target 48 hours, maximum 7 days for on-site verification

**Content Liability:**
- Platform disclaimers for user-generated content accuracy
- Senpai badge does not imply platform endorsement — disclaimer in ToS
- Escalation path: platform mediates → external arbitration if unresolved

## Translation Accuracy & Safety

**Quality Standards:**
- Minimum 80% accuracy threshold before auto-translated content is published
- Food allergy and safety-critical terms flagged for human review
- Disclaimer on all auto-translated content: "This translation is auto-generated. Please verify with staff."

**Business Owner Review:**
- Business owners can review and edit Japanese translations of their listings
- Edit interface shows Vietnamese original alongside Japanese translation
- Changes flagged for quality check before publishing

**Safety-Critical Translation:**
- Menu items containing common allergens (peanuts, shellfish, gluten) auto-flagged
- Medical/health-related content requires human translation verification
- Emergency information (hospital, police) manually translated and verified

## Payment & Commerce (Post-MVP)

**Business Owner Agreement:**
- Digital agreement accepted at registration — covers listing terms, coupon commission rates, platform rules

**Revenue Collection:**
- Ad revenue payments: cash or bank transfer (VND) — flexible for small business owners
- No VAT invoice required from platform to business owners
- Coupon commission deducted automatically, visible in Business Owner Dashboard

**Business Owner Financial Dashboard:**
- Revenue tracking: ad spend, coupon redemptions, commission breakdown
- Payment history and upcoming payment schedule
- Revenue analytics: monthly trends, ROI per coupon campaign
