# Epic 9: Admin Panel & Platform Governance

Admins can manage users and business owners, moderate content with automated filters and human review queue, process fake review disputes, manage staff with RBAC roles, run business verification workflows, and generate platform reports with CSV export.

## Story 9.1: Admin Dashboard & Platform Analytics

As a platform admin,
I want to see a comprehensive dashboard with traffic, revenue, and engagement metrics,
So that I can monitor platform health and make data-driven decisions.

**Acceptance Criteria:**

**Given** I am logged in as Admin and navigate to `/admin/dashboard` (FR39)
**When** the dashboard loads
**Then** top-level KPI cards display: total daily visits, total registered users, total businesses, total active coupons, total revenue (current month)

**Given** the dashboard metrics section
**When** I view engagement metrics
**Then** charts and figures show: daily visits trend (30-day line chart), popular sections breakdown (pie chart), user engagement metrics (reviews/day, posts/day, event registrations/day), new user registration trend

**Given** the dashboard
**When** I view the revenue section
**Then** revenue metrics show: total revenue, ad revenue, commission revenue, month-over-month growth
**And** a breakdown by business category is available

**Given** the admin layout
**When** the page renders
**Then** a sidebar navigation shows role-appropriate menu items based on my admin sub-role
**And** the UI supports English/Vietnamese toggle

## Story 9.2: User & Business Owner Management

As a platform admin,
I want to manage user and business owner accounts with verification workflows,
So that I can maintain platform quality and trust.

**Acceptance Criteria:**

**Given** I navigate to `/admin/users` (FR40)
**When** the user management page loads
**Then** a searchable, sortable table displays: display name, email, role, registration date, status (Active/Suspended/Banned), senpai level, last active date
**And** I can search by name or email
**And** pagination supports large user lists

**Given** I select a user
**When** I view their detail panel
**Then** full profile info displays: account details, activity summary (reviews, posts, events), moderation history
**And** action buttons show: "Suspend" (with reason input), "Ban" (with reason input + confirmation), "Reactivate"

**Given** I navigate to `/admin/users/businesses` (FR41)
**When** the business management page loads
**Then** a table displays: business name, owner name, category, registration date, verification status (Pending/Verified/Rejected/Suspended), listing count

**Given** a business has "Pending" verification status (FR48)
**When** I click to manage verification
**Then** a verification workflow panel shows: business details, submitted documents, photos
**And** I can: "Schedule Visit" (date picker), "Verify" (approve with notes), "Reject" (with reason template)
**And** verification status changes trigger a notification to the business owner

**Given** I suspend or ban an account
**When** the action completes
**Then** an audit log entry is created: timestamp, admin actor, action, reason (NFR17)
**And** the affected user is notified

## Story 9.3: Content Moderation & Auto-Filtering

As a platform admin,
I want automated content filtering and a human review queue,
So that harmful content is caught quickly while minimizing false positives.

**Acceptance Criteria:**

**Given** the backend moderation module (FR42)
**When** database migrations run
**Then** tables are created: moderation_items (content_type, content_id, flag_reason, status, reviewer_id, reviewed_at), banned_keywords (keyword, language, severity)
**And** seed data populates an initial banned keywords list for Japanese and Vietnamese

**Given** a user creates a review, post, or comment
**When** the content is submitted
**Then** the moderation pipeline automatically: checks text against banned keywords list, runs spam detection scoring, flags content exceeding thresholds
**And** flagged items are added to the moderation queue with flag reason

**Given** I navigate to `/admin/moderation` (FR43)
**When** the moderation queue loads
**Then** flagged items display in a priority-sorted list: content preview, flag reason, author info, flagged date, content type (review/post/comment)
**And** filter options: All, Spam, Keywords, Image, Unreviewed

**Given** I review a flagged item
**When** I select it
**Then** full content displays with the flagged portions highlighted
**And** action buttons show: "Approve" (removes flag, content stays), "Remove" (with reason template dropdown: spam, harassment, inappropriate, misinformation, other)
**And** removing content soft-deletes it and notifies the author

**Given** I need to escalate an issue (FR45)
**When** I tap "Escalate"
**Then** a role selector shows available admin sub-roles (content lead, technical, business relations)
**And** I can add an escalation note
**And** the item is reassigned with priority bump

## Story 9.4: Fake Review Disputes & Resolution

As a platform admin,
I want to investigate and resolve fake review complaints from business owners,
So that review integrity is maintained and business owners trust the platform.

**Acceptance Criteria:**

**Given** a business owner files a fake review complaint (from Epic 8, Story 8.4)
**When** I navigate to `/admin/moderation/disputes` (FR44)
**Then** a dispute case list displays: business name, disputed review snippet, complaint reason, filing date, status (Open/Investigating/Resolved)

**Given** I open a dispute case
**When** the detail panel loads
**Then** I see: the full review content, reviewer profile and history, business owner's complaint with evidence, review metadata (creation date, edit history)

**Given** I investigate the dispute
**When** I determine the review is fake
**Then** I can: "Confirm Fake" → soft-delete the review, notify the business owner of resolution, add warning/ban to the violating reviewer
**And** the business owner receives a notification: "Khiếu nại của bạn đã được giải quyết"

**Given** I determine the review is legitimate
**When** I close the dispute
**Then** I can: "Reject Complaint" → mark dispute as resolved, notify business owner with explanation
**And** the review remains published

**Given** any dispute resolution action
**When** the action completes
**Then** an audit log entry records: timestamp, admin, dispute_id, action taken, reason

## Story 9.5: Staff Management, RBAC & Reporting

As a platform admin,
I want to manage staff accounts with role-based access and generate platform reports,
So that the right people have the right access and stakeholders receive regular performance updates.

**Acceptance Criteria:**

**Given** I navigate to `/admin/staff` (FR46)
**When** the staff management page loads
**Then** a table displays: staff name, email, admin sub-role, last active, status
**And** I can: invite new staff (email), assign/change sub-roles, deactivate accounts

**Given** admin sub-roles (FR51)
**When** roles are assigned
**Then** three sub-roles are available: "Content Lead" (moderation queue, content management), "Technical" (platform settings, monitoring), "Business Relations" (BO verification, dispute resolution)
**And** sidebar navigation menu items are filtered based on the assigned sub-role
**And** API endpoints enforce sub-role checks on every request (NFR16)

**Given** I navigate to `/admin/reports` (FR47)
**When** the reporting page loads
**Then** report templates are available: Weekly Summary, Monthly Summary, Moderation Volume
**And** each template shows: configurable date range, preview of included metrics

**Given** I generate a report
**When** I select a template and date range and tap "Generate"
**Then** a report displays with: traffic metrics, revenue breakdown, user growth, moderation stats, top listings, top community threads
**And** charts and tables render inline

**Given** I want to export a report (FR69)
**When** I tap "CSV出力" / "Xuất CSV" (Export CSV)
**Then** a CSV file downloads containing all report data with proper headers and formatting
**And** date/time values follow ISO 8601 format

---
