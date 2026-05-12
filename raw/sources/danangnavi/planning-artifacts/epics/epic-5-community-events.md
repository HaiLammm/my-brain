# Epic 5: Community & Events

Users can browse community groups, join discussions, create posts and comments, view and register for community events and meetups — building the senpai community that powers the platform.

## Story 5.1: Community Hub & Group Browsing

As a Japanese user feeling isolated in Da Nang,
I want to browse an active community hub with groups and trending discussions,
So that I can discover that a vibrant Japanese expat community exists and find topics relevant to me.

**Acceptance Criteria:**

**Given** the backend community module
**When** database migrations run
**Then** tables are created: groups (name_ja, description, icon, category), posts (group_id, user_id, title, body, created_at, deleted_at), comments (post_id, user_id, body, created_at, deleted_at), events, event_registrations
**And** seed data creates 6 community groups: 新人の広場, グルメ・食事, 住まい・生活, イベント, 仕事・ビザ, なんでも相談

**Given** I navigate to `/ja/community` (FR20)
**When** the community hub page loads
**Then** Section 1 header shows: "コミュニティ" title, activity pulse "今日のアクティビティ: X件の投稿 · Y件の返信" in teal, and "＋ 投稿する" button (top-right)

**Given** the community hub page
**When** I view Section 2 category cards
**Then** 6 group cards display in horizontal scroll (mobile) / 2×2 grid (desktop)
**And** each card shows: emoji icon, group name (Japanese), new activity count, teal dot if new since last visit
**And** "新人の広場" (Newcomers) appears first

**Given** the community hub page
**When** I view Section 3 trending discussions
**Then** a "🔥 話題のトピック" section header with "すべて見る →" link displays
**And** 3-5 thread preview cards show: author avatar (36px), author name + senpai badge, thread title (max 2 lines), preview text (1 line truncated), tag chips (max 2), engagement row (💬 replies · ❤️ likes · relative time)

**Given** the community hub page
**When** I view Section 4 upcoming events
**Then** a "🎉 今週のイベント" section header with "すべて見る →" displays
**And** horizontal scroll event cards (240px wide) show: cover photo, title, date/time, location, attendee avatar stack + count, optional "初心者歓迎" tag

**Given** the community hub page
**When** I view Section 5 recent activity feed
**Then** 5 recent activity items display: icon + activity text + relative time
**And** activities include: new replies, new members, like milestones, event participation updates

**Given** I am a guest (not logged in)
**When** I browse the community hub
**Then** all content is visible in read-only mode (FR20)
**And** "＋ 投稿する" button triggers signup modal if tapped

## Story 5.2: Join Groups & Create Posts/Comments

As a registered user,
I want to join community groups and create posts and comments,
So that I can participate in discussions and connect with other Japanese expats.

**Acceptance Criteria:**

**Given** I am logged in and viewing a community group (FR21)
**When** I see the group I want to join
**Then** a "参加する" (Join) button is visible
**And** tapping it joins me to the group and the button changes to "参加中" (Joined)
**And** tapping "参加中" shows an option to leave the group

**Given** I am a member of a group (FR22)
**When** I tap "＋ 投稿する" (New Post)
**Then** a post composer opens with: title field (required), body text area (required), tag selector (optional, max 3), photo upload button (optional)
**And** submitting creates the post and shows a toast "投稿しました"
**And** a post.created event fires on the event bus (triggers gamification + moderation)

**Given** I am not a member of a group
**When** I tap "＋ 投稿する"
**Then** a prompt asks me to join the group first
**And** after joining, the post composer opens

**Given** I am viewing a thread
**When** I want to reply
**Then** a reply composer at the bottom shows: text area, photo upload icon, "返信" (Reply) submit button
**And** submitting adds my comment to the thread in real-time
**And** a comment.created event fires (triggers gamification)

**Given** I am not logged in and try to post or comment
**When** the auth check triggers (FR53)
**Then** the signup modal appears

## Story 5.3: Community Thread Detail

As a user interested in a discussion topic,
I want to read a full thread with replies and senpai-marked contributions,
So that I can find detailed answers and engage with the community.

**Acceptance Criteria:**

**Given** I tap a thread card on the community hub
**When** the thread detail page loads at `/ja/community/[group_slug]`
**Then** the thread header shows: title, author avatar + name + senpai badge, group name, post date, tag chips
**And** the original post body displays with full text and any attached photos

**Given** the thread has replies
**When** I scroll down
**Then** reply cards display chronologically: avatar (36px), author name + senpai badge, reply text, attached photos, relative timestamp
**And** each reply has a ❤️ like button with count
**And** senpai-badged replies have a subtle visual distinction (teal left border)

**Given** the thread has many replies
**When** I scroll to load more
**Then** pagination loads additional replies (20 per page)
**And** a "もっと見る" button or infinite scroll loads the next batch

**Given** the reply composer at the bottom
**When** I tap it
**Then** the composer expands with text area + photo upload icon + "返信" button
**And** on mobile, the keyboard pushes the composer up

## Story 5.4: Events & Meetups

As a Japanese user wanting to make friends in Da Nang,
I want to browse and register for community events and meetups,
So that I can meet other Japanese expats in person and build real connections.

**Acceptance Criteria:**

**Given** I navigate to the events page at `/ja/community/events` (FR23)
**When** the page loads
**Then** a list/calendar toggle (SegmentedControl) allows switching between list and calendar views
**And** filter chips display: すべて, 今週, 今月, 初心者歓迎

**Given** the events list view
**When** events are displayed
**Then** event cards show: cover photo (240px × 120px), title, date/time with 📅 icon, location with 📍 icon, attendee avatar stack (3 overlapping 24px avatars) + "X人参加予定" count
**And** events tagged "初心者歓迎" (Newcomers Welcome) show a teal pill badge

**Given** I tap an event card (FR24)
**When** the event detail displays
**Then** full details show: title, description, date/time, location (with map link), organizer info, attendee list, and "参加する" (Join) CTA button

**Given** I tap "参加する" on an event
**When** I am logged in
**Then** a confirmation modal appears with checkmark animation
**And** I am added to the attendee list
**And** the attendee count updates
**And** an event.registered event fires (triggers gamification + notification for reminder)

**Given** I am not logged in and tap "参加する"
**When** the auth check triggers
**Then** the signup modal appears, and after login, the registration completes

**Given** no events match the selected filter
**When** the empty state displays
**Then** a friendly message shows "イベントはまだありません" with a suggestion to check back later

---
