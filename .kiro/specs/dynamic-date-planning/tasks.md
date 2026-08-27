# Implementation Plan: Dynamic Date Planning

## Overview

This plan incrementally adds URL-based routing, a creation screen, date-planning flow (calendar + venue + confirmation), and a Date Pass view to the existing confession app. Each task builds on previous ones, with property tests validating core logic. The existing proposal flow is extracted into a sub-component first, then new features layer on top.

## Tasks

- [x] 1. URL utilities and i18n extension
  - [x] 1.1 Create `src/utils/urlParams.ts` with URL parameter parsing and construction functions
    - Implement `parseUrlParams()` → returns `AppState` object
    - Implement `buildProposalUrl(from, to)` → returns full URL string
    - Implement `buildConfirmationUrl(from, to, date, venue)` → returns full URL string
    - Implement `isValidIsoDate(str)` → boolean validation
    - Implement `validateName(str)` → boolean (rejects empty/whitespace-only)
    - _Requirements: 1.2, 1.3, 2.1, 2.4, 2.5, 13.1, 13.2_

  - [x] 1.2 Write property tests for URL utilities
    - **Property 1: URL Parameter Round-Trip**
    - **Property 2: Whitespace Name Rejection**
    - **Property 8: Confirmation URL Construction**
    - **Validates: Requirements 1.2, 1.3, 2.1, 2.5, 8.2**

  - [x] 1.3 Create `src/utils/dateUtils.ts` with calendar and date formatting functions
    - Implement `getDaysInMonth(year, month)` → number
    - Implement `generateCalendarGrid(year, month, selectedIso, today)` → `CalendarDay[]`
    - Implement `formatDateHuman(iso, locale?)` → human-readable string
    - Implement `toIsoDate(date)` → YYYY-MM-DD string
    - Implement `isDatePast(iso, today)` → boolean
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 6.7, 6.8_

  - [x] 1.4 Write property tests for date utilities
    - **Property 4: Calendar Day Count Accuracy**
    - **Property 5: Past Date Rejection**
    - **Property 6: Future/Today Date Selection**
    - **Property 7: Date Format Round-Trip**
    - **Property 10: Past Month Navigation Disabled**
    - **Validates: Requirements 6.1, 6.3, 6.4, 6.5, 6.7, 6.8**

  - [x] 1.5 Extend `src/i18n.ts` with new translation keys
    - Add all new keys to the `Translation` interface
    - Add English translations for all new strings
    - Add Chinese translations for all new strings
    - Keep existing translations untouched
    - _Requirements: 12.1, 12.2, 12.3_

- [x] 2. Refactor App.tsx and implement AppRouter
  - [x] 2.1 Extract existing proposal logic from `App.tsx` into `src/components/ProposalFlow.tsx`
    - Move disclaimer, carousel, Yes/No, celebration logic into ProposalFlow component
    - Accept `from`, `to`, `mode`, `onModeChange` props
    - Add `onDatePlanningReady` callback prop (fires after celebration + pause)
    - Substitute sender name into dialogue placeholders using `from` prop
    - Preserve all existing behavior exactly
    - _Requirements: 3.1, 3.2, 3.3, 14.1, 14.2, 14.3_

  - [x] 2.2 Write property test for name substitution
    - **Property 3: Name Substitution Completeness**
    - **Validates: Requirements 3.1**

  - [x] 2.3 Implement `AppRouter` in `App.tsx`
    - Use `parseUrlParams()` to determine initial view on mount
    - Render `CreationScreen`, `ProposalFlow`, or `DatePass` based on state
    - Pass language mode state and LanguageSelect down to child views
    - Handle invalid/incomplete URL params with graceful fallback to creation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 13.1, 13.2, 13.3_

- [x] 3. Checkpoint — Core routing and utilities
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Creation Screen
  - [x] 4.1 Implement `src/components/CreationScreen.tsx`
    - Two input fields: sender name, recipient name
    - Generate Link button (disabled when names invalid)
    - On submit: call `buildProposalUrl`, display result
    - Copy Link button using clipboard API with "Link copied!" feedback
    - Use GlassCard wrapper, match existing dark-space aesthetic
    - Mobile-responsive layout (min 44px touch targets)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.4, 14.2_

  - [x] 4.2 Write unit tests for CreationScreen
    - Test empty/whitespace name rejection
    - Test successful URL generation and display
    - Test copy button interaction
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Emotional timing and date planning orchestration
  - [x] 5.1 Implement surprise reveal timing in ProposalFlow
    - After `meteorActive` → false (onComplete), start 3-5 second pause timer
    - During pause: show only happy message + GIF (no extra UI)
    - After pause: call `onDatePlanningReady` callback
    - Add 5-second timeout guard to force-complete pause
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.2 Implement `src/components/DatePlanningFlow.tsx`
    - Orchestrate steps: calendar → venue → confirm → done
    - Manage `PlanningStep` state and selected date/venue
    - On confirmation: call `history.replaceState` to update URL
    - Render with fadeSlideUp animation on entry
    - _Requirements: 4.4, 8.2, 8.3_

- [x] 6. Calendar and Finger Guide
  - [x] 6.1 Implement `src/components/CalendarComponent.tsx`
    - Monthly grid using `generateCalendarGrid` utility
    - Previous/Next month navigation buttons
    - Disable previous when at current month
    - Past dates visually disabled and non-interactive
    - Selected date highlighted with rose accent
    - Display human-readable selected date below grid
    - Continue button enabled only when date selected
    - Mobile: min 44px cells, responsive grid
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 11.1_

  - [x] 6.2 Implement `src/components/FingerGuide.tsx`
    - Render animated pointing emoji (☝️) near calendar
    - Bounce/pulse CSS animation (use tailwind keyframe)
    - Accept `visible` prop; render nothing when false
    - Position: below or beside calendar, not overlapping cells
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.3 Write unit tests for CalendarComponent
    - Test month navigation
    - Test past date non-selection
    - Test future date selection
    - Test Continue button state
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Venue Selection and Confirmation
  - [x] 7.1 Implement `src/components/VenueSelector.tsx`
    - Render preset venue options as selectable cards/radio buttons
    - "Custom venue" option reveals text input
    - Continue button enabled only when venue selected (non-empty)
    - Use GlassCard styling, mobile-friendly layout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 11.2_

  - [x] 7.2 Write property test for venue validation
    - **Property 9: Venue Validation — Continue Button State**
    - **Validates: Requirements 7.4**

  - [x] 7.3 Implement `src/components/ConfirmationScreen.tsx`
    - Display both names, selected date (human-readable), venue
    - Confirm Date button
    - On confirm: trigger URL update and transition to Date Pass
    - GlassCard styling
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 7.4 Write unit tests for VenueSelector and ConfirmationScreen
    - Test venue option selection
    - Test custom venue input
    - Test confirmation display content
    - _Requirements: 7.1, 7.2, 7.3, 8.1_

- [x] 8. Checkpoint — Date planning flow complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Date Pass and Sharing
  - [x] 9.1 Implement `src/components/DatePass.tsx`
    - Polished digital ticket/card design
    - Display: "{from} ❤️ {to}", date (human-readable), venue, "DATE CONFIRMED" badge
    - Use GlassCard, glassmorphism effects, rose accent colors
    - Copy Link button with clipboard API + "✓ Link copied!" feedback
    - Share button using Web Share API (hidden if unsupported)
    - Mobile-responsive layout
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 9.1, 9.2, 9.3, 9.4, 11.3_

  - [x] 9.2 Write unit tests for DatePass
    - Test rendering with valid params
    - Test copy link functionality
    - Test share button visibility based on API support
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 10. Integration wiring and final polish
  - [x] 10.1 Wire all components together in AppRouter
    - Connect CreationScreen → URL generation
    - Connect ProposalFlow → DatePlanningFlow transition (with emotional timing)
    - Connect DatePlanningFlow → DatePass transition (via URL update)
    - Connect direct DatePass rendering from URL params
    - Verify language selector works on all screens
    - _Requirements: 2.2, 2.3, 2.6, 4.4, 8.3, 12.3, 14.3_

  - [x] 10.2 Add `valentine.css` keyframes for finger guide animation
    - Add `fingerBounce` keyframe (translateY bounce + slight opacity pulse)
    - Keep existing `meteorDiagonal` keyframe intact
    - _Requirements: 5.2_

  - [x] 10.3 Write integration tests for full flow
    - Test creation → link generation
    - Test URL with from+to → proposal flow renders
    - Test URL with all accepted params → Date Pass renders
    - Test invalid URL fallback to creation
    - _Requirements: 2.2, 2.3, 2.4, 13.1, 13.2, 14.1_

- [x] 11. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (10 properties total)
- Unit tests validate specific examples and edge cases
- The existing `App.integration.test.tsx` should continue passing after refactor
- Implementation uses TypeScript throughout (matches existing project)
- No new npm dependencies needed — calendar and routing built from scratch
- The emotional timing (task 5.1) is the most critical UX piece — test with fake timers

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "1.5"] },
    { "id": 1, "tasks": ["1.2", "1.4", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "5.1"] },
    { "id": 4, "tasks": ["4.2", "5.2", "6.1", "6.2"] },
    { "id": 5, "tasks": ["6.3", "7.1"] },
    { "id": 6, "tasks": ["7.2", "7.3"] },
    { "id": 7, "tasks": ["7.4", "9.1"] },
    { "id": 8, "tasks": ["9.2", "10.1", "10.2"] },
    { "id": 9, "tasks": ["10.3"] }
  ]
}
```
