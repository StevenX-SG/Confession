"use client";
import { useState } from "react";
import "./valentine.css";
import ProposalFlow from "./components/ProposalFlow";
import CreationScreen from "./components/CreationScreen";
import DatePlanningFlow from "./components/DatePlanningFlow";
import DatePass from "./components/DatePass";
import { parseUrlParams, type AppState } from "./utils/urlParams";
import { type DisplayMode } from "./i18n";

/**
 * AppRouter — top-level, URL-parameter-driven router.
 *
 * On mount it reads the current URL search parameters via `parseUrlParams()`
 * and renders one of three views based on the derived `AppState.view`
 * (Requirements 2.1, 2.2, 2.3, 2.6):
 *
 * - `creation`  → CreationScreen (no usable params)
 * - `proposal`  → ProposalFlow  (`from` + `to`)
 * - `date-pass` → DatePass      (`from` + `to` + `status=accepted` + valid `date` + `venue`)
 *
 * Invalid or incomplete params are handled gracefully: `parseUrlParams()` already
 * falls back to `{ view: 'creation' }` for those cases, so routing purely on its
 * return value guarantees the app never shows a blank/crashed screen
 * (Requirements 2.4, 13.1, 13.2, 13.3).
 *
 * This wrapper owns the display-mode (language) state and passes `mode` /
 * `onModeChange` down to whichever child view renders, so the language selector
 * keeps working across screens (Requirement 12.3, 14.3).
 *
 * The parsed state is captured once on mount via lazy `useState` initialization —
 * routing is determined by the URL present when the page loads (and on refresh),
 * matching Requirement 2.6.
 *
 * Within the `proposal` view the router additionally owns the celebration →
 * date-planning transition: once ProposalFlow fires `onDatePlanningReady` (after
 * the surprise-reveal pause), `showDatePlanning` flips and DatePlanningFlow takes
 * over in place (Requirements 4.4, 8.3). DatePlanningFlow itself updates the URL
 * via `history.replaceState` on confirmation and then renders the DatePass.
 */
export default function AppRouter() {
  // Default display mode shows English + Chinese together; selecting a single
  // language from the dropdown switches to that language only.
  const [mode, setMode] = useState<DisplayMode>('en-zh');

  // Parse URL params once on mount. Lazy initializer avoids re-parsing on every
  // render; a page refresh re-runs this and restores the same view (Req 2.6).
  const [appState] = useState<AppState>(() => parseUrlParams());

  // Whether the proposal flow has handed off to date planning. Flipped by
  // ProposalFlow's `onDatePlanningReady` callback after the celebration + pause.
  const [showDatePlanning, setShowDatePlanning] = useState(false);

  switch (appState.view) {
    case 'proposal':
      // After the surprise-reveal pause, swap the proposal experience for the
      // date-planning flow (Requirement 4.4). The recipient carries the same
      // language mode into planning (Requirement 12.3).
      if (showDatePlanning) {
        return (
          <DatePlanningFlow
            from={appState.from ?? ''}
            to={appState.to ?? ''}
            region={appState.region}
            mode={mode}
          />
        );
      }
      return (
        <ProposalFlow
          from={appState.from ?? ''}
          to={appState.to ?? ''}
          senderGender={appState.senderGender}
          evilMode={appState.evilMode}
          mode={mode}
          onModeChange={setMode}
          onDatePlanningReady={() => setShowDatePlanning(true)}
        />
      );

    case 'date-pass':
      return (
        <DatePass
          from={appState.from ?? ''}
          to={appState.to ?? ''}
          date={appState.date ?? ''}
          venue={appState.venue ?? ''}
          spot={appState.spot}
          mode={mode}
        />
      );

    case 'creation':
    default:
      return <CreationScreen mode={mode} onModeChange={setMode} />;
  }
}
