# Requirements Document

## Introduction

The Dynamic Date Planning feature enhances the existing confession/proposal app by adding a post-acceptance flow: after the recipient says "Yes," a surprise date-planning experience appears. The feature also adds URL-parameter-based routing so senders can personalize proposals with names, and confirmed dates produce shareable "Date Pass" tickets. The entire flow remains static (no backend) and preserves the existing dark-space glassmorphism aesthetic.

## Glossary

- **App**: The React single-page confession/proposal application
- **Sender**: The person creating and sharing the proposal link
- **Recipient**: The person receiving and viewing the proposal
- **Creation_Screen**: The initial screen shown when no URL parameters are present, allowing the Sender to enter names and generate a link
- **Proposal_Flow**: The existing disclaimer → carousel → Yes/No experience
- **Celebration_Animation**: The existing sky-brightening + meteor shower sequence triggered by clicking Yes
- **Calendar_Component**: A custom-built monthly calendar grid for date selection
- **Venue_Selector**: A component offering preset venue choices plus a custom text input
- **Date_Pass**: A polished digital ticket/card showing confirmed date details
- **URL_Router**: Logic that reads URL search parameters on mount to determine which screen to render
- **Surprise_Reveal**: The intentional pause followed by calendar appearance after the celebration completes
- **Finger_Guide**: An animated pointing indicator directing the Recipient toward the calendar

## Requirements

### Requirement 1: Dynamic Proposal Creation

**User Story:** As a Sender, I want to enter my name and the Recipient's name to generate a personalized proposal link, so that the confession feels personal without hard-coding names in source code.

#### Acceptance Criteria

1. WHEN the App loads without `from` or `to` URL parameters, THE Creation_Screen SHALL display input fields for sender name and recipient name
2. WHEN the Sender submits both names, THE Creation_Screen SHALL generate a shareable URL containing `from` and `to` parameters with URL-encoded values
3. THE Creation_Screen SHALL prevent submission when either name field is empty or contains only whitespace
4. WHEN the Sender copies the generated link, THE App SHALL provide a copy-to-clipboard button with visual confirmation feedback

### Requirement 2: URL Parameter Routing

**User Story:** As a user, I want the app to determine its state from URL parameters, so that links are shareable and refreshing preserves state.

#### Acceptance Criteria

1. WHEN the App mounts, THE URL_Router SHALL parse `from`, `to`, `status`, `date`, and `venue` search parameters from the current URL
2. WHEN both `from` and `to` parameters are present without `status=accepted`, THE URL_Router SHALL render the Proposal_Flow with the parsed names
3. WHEN `from`, `to`, `status=accepted`, `date`, and `venue` parameters are all present, THE URL_Router SHALL render the Date_Pass directly
4. WHEN the `to` parameter is missing but `from` is present, THE URL_Router SHALL redirect to the Creation_Screen
5. THE URL_Router SHALL decode URL-encoded parameter values including spaces and special characters correctly
6. WHEN the browser page is refreshed, THE URL_Router SHALL restore the same view state from the URL parameters

### Requirement 3: Personalized Proposal Flow

**User Story:** As a Recipient, I want to see the Sender's name in the proposal dialogues, so that the confession feels personal and authentic.

#### Acceptance Criteria

1. WHEN the Proposal_Flow renders with `from` and `to` parameters, THE App SHALL substitute the Sender's name into dialogue text where name placeholders exist
2. THE Proposal_Flow SHALL preserve the existing disclaimer → carousel → Yes/No interaction sequence without modification
3. WHEN the Recipient clicks the Yes button, THE App SHALL trigger the existing Celebration_Animation immediately

### Requirement 4: Emotional Timing — Surprise Reveal

**User Story:** As a Recipient, I want the date-planning step to appear as a surprise after the celebration, so that the experience feels emotionally layered and delightful.

#### Acceptance Criteria

1. WHILE the Celebration_Animation is playing, THE App SHALL NOT display the Calendar_Component or any date-planning UI
2. WHEN the Celebration_Animation completes (meteor shower `onComplete` fires), THE App SHALL start a 3-to-5-second intentional pause timer
3. WHILE the pause timer is active, THE App SHALL display only the celebration result (happy message and GIF) with no loading indicators, countdowns, or previews
4. WHEN the pause timer expires, THE App SHALL transition smoothly into the date-selection step using the existing fadeSlideUp animation
5. IF the pause timer exceeds 5 seconds without completing, THEN THE App SHALL force-complete the timer and proceed to the date-selection step

### Requirement 5: Animated Finger-Pointing Guide

**User Story:** As a Recipient, I want a visual hint directing me toward the calendar, so that the surprise reveal is intuitive and I know what to do next.

#### Acceptance Criteria

1. WHEN the date-selection step appears, THE Finger_Guide SHALL render an animated pointing indicator directed toward the Calendar_Component
2. THE Finger_Guide SHALL use a subtle bounce or pulse animation that does not obstruct the Calendar_Component controls
3. WHEN the Recipient interacts with the Calendar_Component (click or tap on any calendar element), THE Finger_Guide SHALL disappear immediately
4. THE Finger_Guide SHALL be positioned so it does not overlap touch targets on mobile devices

### Requirement 6: Interactive Calendar

**User Story:** As a Recipient, I want to pick a date from a visual calendar, so that selecting a date feels intuitive and engaging rather than typing into a date input.

#### Acceptance Criteria

1. THE Calendar_Component SHALL display a full monthly grid showing day numbers for the current month
2. THE Calendar_Component SHALL provide navigation controls to move to the next and previous months
3. THE Calendar_Component SHALL disable navigation to months before the current month
4. WHEN a date cell representing today or a future date is tapped, THE Calendar_Component SHALL mark that date as selected with a visible highlight
5. WHEN a date cell representing a past date is tapped, THE Calendar_Component SHALL ignore the interaction and keep past dates visually disabled
6. THE Calendar_Component SHALL render each date cell with a minimum touch-target size of 44px on mobile devices
7. WHEN a date is selected, THE Calendar_Component SHALL display the selected date in a human-readable format (e.g., "Sunday, 30 August 2026")
8. THE Calendar_Component SHALL store the selected date internally in ISO 8601 format (YYYY-MM-DD)

### Requirement 7: Venue Selection

**User Story:** As a Recipient, I want to choose a venue for the date, so that the plan feels complete and actionable.

#### Acceptance Criteria

1. WHEN the date is selected and the Recipient continues, THE Venue_Selector SHALL display preset venue options as selectable radio-style choices
2. THE Venue_Selector SHALL include the following preset options: Marina Bay, Gardens by the Bay, Jewel Changi Airport, Sentosa, and a Custom venue option
3. WHEN the Custom venue option is selected, THE Venue_Selector SHALL display a text input field for the Recipient to type a venue name
4. THE Venue_Selector SHALL enable the Continue button only when a venue is selected (or custom text is entered)
5. THE Venue_Selector SHALL render all options with a minimum touch-target height of 44px on mobile

### Requirement 8: Date and Venue Confirmation

**User Story:** As a Recipient, I want to review my date and venue selection before finalizing, so that I can verify the details are correct.

#### Acceptance Criteria

1. WHEN the Recipient proceeds from venue selection, THE App SHALL display a confirmation screen showing both names (from URL), the selected date in human-readable format, and the selected venue
2. WHEN the Recipient clicks the Confirm button, THE App SHALL update the browser URL to include `status=accepted`, `date` (ISO format), and `venue` (URL-encoded) parameters using `history.replaceState`
3. WHEN the URL is updated after confirmation, THE App SHALL transition to the shareable link and Date_Pass view

### Requirement 9: Shareable Confirmation Link

**User Story:** As a Recipient, I want to share the confirmed date details with the Sender, so that both parties have a record of the plan.

#### Acceptance Criteria

1. WHEN the confirmation is complete, THE App SHALL display the full confirmation URL in a shareable format
2. WHEN the Recipient clicks the Copy Link button, THE App SHALL copy the current URL to the clipboard and display a "Link copied!" confirmation for at least 2 seconds
3. WHERE the Web Share API is available, THE App SHALL display a Share button that invokes the native share dialog
4. WHERE the Web Share API is not available, THE App SHALL hide the Share button and rely on the Copy Link functionality

### Requirement 10: Confirmed Date Pass

**User Story:** As a Sender or Recipient, I want to view a polished Date Pass when opening the confirmed link, so that the date plan feels celebratory and official.

#### Acceptance Criteria

1. WHEN the App loads with `status=accepted`, valid `date`, and valid `venue` URL parameters, THE Date_Pass SHALL render immediately without showing the proposal flow
2. THE Date_Pass SHALL display both names (Sender and Recipient) with a heart separator
3. THE Date_Pass SHALL display the confirmed date in human-readable format
4. THE Date_Pass SHALL display the venue name
5. THE Date_Pass SHALL display a "DATE CONFIRMED" badge or label
6. THE Date_Pass SHALL use the existing GlassCard styling and dark-space aesthetic

### Requirement 11: Mobile Experience

**User Story:** As a mobile user, I want all new screens and components to be usable on my phone, so that the experience works regardless of device.

#### Acceptance Criteria

1. THE Calendar_Component SHALL adapt its grid layout to fit screens narrower than 768px without horizontal scrolling
2. THE Venue_Selector SHALL stack options vertically on mobile with adequate spacing between touch targets
3. THE Date_Pass SHALL scale its content to fit mobile viewports without overflow
4. THE Creation_Screen SHALL render input fields and buttons at mobile-friendly sizes with minimum 44px touch targets

### Requirement 12: i18n Integration

**User Story:** As a developer, I want new UI text to integrate with the existing i18n system, so that future translations can be added consistently.

#### Acceptance Criteria

1. THE App SHALL define all new user-facing strings in the existing `translations` object in `src/i18n.ts`
2. THE App SHALL support English for all new strings at minimum
3. WHEN a language is selected via the language dropdown, THE App SHALL display new UI text in the selected language where translations exist

### Requirement 13: Error Handling

**User Story:** As a user, I want the app to handle invalid or incomplete URLs gracefully, so that I never see a blank screen or crash.

#### Acceptance Criteria

1. IF the URL contains `status=accepted` but is missing `date` or `venue`, THEN THE URL_Router SHALL fall back to the Creation_Screen
2. IF the `date` parameter contains an invalid date string, THEN THE App SHALL fall back to the Creation_Screen
3. THE App SHALL never display an unhandled error or blank screen due to malformed URL parameters

### Requirement 14: Preserve Existing Functionality

**User Story:** As a user of the existing app, I want the original proposal experience to remain fully functional, so that nothing breaks for people already using it.

#### Acceptance Criteria

1. THE App SHALL preserve the existing disclaimer → carousel → Yes/No → celebration → response flow without behavioral changes
2. THE App SHALL preserve the existing visual style including GlassCard, StarfieldCanvas, MeteorShower, and NoButton components
3. THE App SHALL preserve the existing language selector and all current translations
