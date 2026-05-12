# 05: Naoki & Tomoko Sign Up

**Project:** DaNangNavi
**Created:** 2026-04-07
**Method:** Whiteport Design Studio (WDS)
**Design Intent:** Dream Up (D)
**Design Status:** not-started

---

## Transaction (Q1)

**What this scenario covers:**
Create an account quickly to save content and access community features, then set notification preferences to stay updated.

---

## Business Goal (Q2)

**Goal:** #2 Daily User Traffic (50K/day) + #3 User Retention (60%+ returning visitors)
**Objective:** Registered users enable personalization, push notifications, and cross-session tracking

---

## User & Situation (Q3)

**Persona:** Naoki (Primary)
**Situation:** During his first browsing session (Scenario 01), Naoki found an apartment listing he wants to save but hits a signup prompt. He's already convinced DaNangNavi is useful — just wants the signup to be fast so he doesn't lose the listing.

---

## Driving Forces (Q4)

**Hope:** Quick signup so he can save this apartment and come back to it later.

**Worry:** Another long registration form asking for unnecessary personal information.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile (smartphone)
**Entry:** Tapped "Save to favorites" on a listing detail page during Scenario 01, signup modal appears over the listing.

---

## Best Outcome (Q7)

**User Success:**
Signed up in under 30 seconds via LINE login, apartment saved, notifications set for new listings in his preferred area — zero friction.

**Business Success:**
Registered user with profile data for personalization, push notification opt-in for retention, trackable across sessions for analytics.

---

## Shortest Path (Q8)

1. **Sign Up / Login** — Taps LINE login button, authorizes in 2 taps, account created with Japanese defaults automatically
2. **Notification Center** — Sets preferences: new apartments in preferred area, community replies, weekly deals digest ✓

---

## Trigger Map Connections

**Persona:** Naoki the Newcomer (Primary) — also represents Tomoko's signup path

**Driving Forces Addressed:**
- ✅ **Want:** Feel confident navigating daily life — saving places enables return visits
- ❌ **Fear:** Being overwhelmed by complexity — signup must be frictionless

**Business Goal:** #2 Daily User Traffic + #3 User Retention (60%+ returning visitors)

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 05.1 | `05.1-sign-up-login/` | Create account via LINE login with minimal friction | Account created, redirected to notification setup |
| 05.2 | `05.2-notification-center/` | Set notification preferences for relevant updates | Saves preferences, returns to the listing he wanted to save ✓ |
