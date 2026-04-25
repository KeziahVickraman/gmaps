# CLAUDE.md — Google Maps UXR Redesign
> Read this entire file before writing a single line of code.
> This is the authoritative spec. All implementation decisions trace back here.

---

## 1. Project Purpose

A **UXR-informed redesign of Google Maps** as a React + Vite web app.
Grounded in **41 interview quotes** across **5 validated pain-point clusters**.
All data is mock/static — no Google Maps API, no backend.
The app must feel production-grade: real interactions, real UI states, real edge cases handled.

Design principles baked into every screen (from your Stitch prompts):
- **Fitts's Law** — primary resolution path within 2 taps/clicks max
- **Miller's Law** — cap simultaneous choices at 5 per screen; chunk aggressively
- **Hick's Law** — progressive disclosure for secondary actions
- Every screen must have: happy path · empty state · loading state · non-modal error state

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | TailwindCSS v3 |
| Routing | React Router v6 |
| State | React Context + useReducer |
| Icons | lucide-react |
| Map Canvas | Custom SVG mock map with pin rendering |
| Fonts | Syne (display headings) + DM Sans (body) via Google Fonts |
| Mock Data | Local JSON files in `/src/data/` |
| Animation | Framer Motion (page transitions + sheet animations) |

---

## 3. Folder Structure

```
google-maps-redesign/
├── CLAUDE.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── data/
    │   ├── places.json           ← 50+ mock restaurants/places (see § 6)
    │   ├── savedLists.json       ← mock user saved lists + tags
    │   ├── routes.json           ← mock route options (3 variants per OD pair)
    │   └── userPreferences.json  ← mock preference profile (cuisines, dietary, past orders)
    │
    ├── context/
    │   ├── MapContext.jsx        ← active place, active route, map viewport state
    │   ├── FilterContext.jsx     ← all filter state (cuisine, diet, price, ambience)
    │   ├── PreferenceContext.jsx ← user taste profile, past choices, preference signals
    │   └── UserContext.jsx       ← mock user profile, saved places, recent searches
    │
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.jsx      ← top bar + sidebar + map canvas wrapper
    │   │   ├── Sidebar.jsx       ← left panel, context-switches per active view
    │   │   ├── TopBar.jsx        ← search bar + cluster nav tabs
    │   │   └── MapCanvas.jsx     ← SVG mock map, renders pins from context
    │   │
    │   ├── search/               ← CLUSTER 1 screens
    │   │   ├── SearchBar.jsx
    │   │   ├── SuggestionChips.jsx
    │   │   ├── FilterPanel.jsx
    │   │   ├── SearchResults.jsx
    │   │   └── EmptySearchState.jsx
    │   │
    │   ├── restaurant/           ← CLUSTER 1 + CLUSTER 4: restaurant filters + preference matching
    │   │   ├── RestaurantCard.jsx
    │   │   ├── RestaurantDetail.jsx
    │   │   ├── RestaurantFilters.jsx
    │   │   ├── BusynessIndicator.jsx
    │   │   ├── PreferenceMatchBadge.jsx ← "Matches your taste" signal on cards
    │   │   ├── TasteProfilePanel.jsx    ← editable user preference profile
    │   │   └── NoMatchFallback.jsx      ← smart fallback when nothing fits preferences
    │   │
    │   ├── navigation/           ← CLUSTER 2 screens
    │   │   ├── RouteOptions.jsx
    │   │   ├── TurnByTurn.jsx
    │   │   ├── RerouteAlert.jsx
    │   │   └── RouteCompare.jsx
    │   │
    │   ├── saved/                ← CLUSTER 3 screens
    │   │   ├── SavedLists.jsx
    │   │   ├── ListDetail.jsx
    │   │   ├── SavePlaceSheet.jsx
    │   │   └── EmptyListState.jsx
    │   │
    │   ├── onboarding/           ← CLUSTER 3 screens
    │   │   ├── RecentSearches.jsx
    │   │   ├── ContextualPrompts.jsx
    │   │   └── HomeScreen.jsx
    │   │
    │   └── shared/
    │       ├── Pin.jsx
    │       ├── BottomSheet.jsx
    │       ├── FilterChip.jsx
    │       ├── ErrorBanner.jsx
    │       ├── LoadingSkeleton.jsx
    │       └── EmptyState.jsx
    │
    └── views/
        ├── HomeView.jsx          ← Cluster 3: re-entry + contextual prompts
        ├── SearchView.jsx        ← Cluster 1: discovery + restaurant filters
        ├── RestaurantView.jsx    ← Cluster 4: preference-aware restaurant finding
        ├── NavigationView.jsx    ← Cluster 2: routing + turn-by-turn
        └── SavedView.jsx         ← Cluster 3: saved lists + places
```

---

## 4. The Five UXR Clusters — Screen-by-Screen Specs

Each cluster maps directly to your validated interview data.
Build each as its own `View`, navigable from the top tab bar.

---

### CLUSTER 1 — Restaurant Discovery & Dietary Filter Failure
**Validated from 14 interview quotes**

**Core pain point:** Users searching for dietary-specific restaurants (e.g. vegetarian) receive irrelevant results; the scrolling list is overwhelming and unfiltered by intent.

**Verbatim user signals driving design:**
- *"searches in the main tab vegetarian restaurants… suggestions are wrong (non-veg options presented)"* — S1_I004
- *"clicked on restaurant tab, toggled at various locations on map, clicked on each location provided. looked at ratings, reviews and photos to decide which restaurant."* — S2_I006
- *"ah let me see opens up restaurant tab and stares at it and scrolls excessively. he is thinking about what he wants to eat (something not heavy, healthy, and nearby) and then finds it."* — S1_I003

**What this means for UI:**
- Dietary filter (`Vegetarian` · `Vegan` · `Halal` · `Gluten-free`) must be **first-class**, not buried
- Filter state must be **visually persistent** — always visible on results, not dismissable
- List must **re-rank in real time** on filter change — no full reload UX
- Each card shows: cuisine tag · dietary badge · distance · live busyness indicator · price tier

**Screens to build:**

#### `SearchView.jsx`
- Top: `SearchBar` with `SuggestionChips` (max 5 chips: Vegetarian · Nearby · Open Now · Trending · Budget)
- Left panel: `FilterPanel` with sections:
  - **Dietary** (Vegetarian / Vegan / Halal / Gluten-free) — multiselect pill group
  - **Cuisine** (max 5 shown, "+ more" expands) — Hick's Law applied
  - **Price** ($ / $$ / $$$ / $$$$) — segmented control
  - **Ambience** (Casual / Family / Romantic / Quiet) — icon + label tiles
  - **Distance** — slider (0.5km to 5km)
  - **Open now** — toggle
- Main: `SearchResults` list — `RestaurantCard` per item
- Map: pins colour-coded by dietary match (green = full match, yellow = partial, grey = no match)

#### `RestaurantCard.jsx`
Fields: name · cuisine · dietary badges · distance · rating (stars + count) · price tier · busyness bar · "Save" icon button

#### `RestaurantDetail.jsx`
Fields: hero image · name · all filter attributes · hours · address · "Start Navigation" CTA · "Save to List" CTA
Progressive disclosure: reviews collapsed by default, tap to expand

#### States required:
- **Empty state**: "No vegetarian restaurants match your filters. Try expanding your distance or removing a filter." + two shortcut buttons to do exactly that
- **Loading state**: skeleton cards (3 visible)
- **Error state**: inline banner "Couldn't load results. Check your connection." with retry — no modal

---

### CLUSTER 2 — Navigation Rerouting & Route Trust
**Validated from 9 interview quotes**

**Core pain point:** Users lose trust mid-journey when rerouting happens silently or route options don't match real-world conditions (driving direction, fastest path).

**Verbatim user signals driving design:**
- *"Bad- doesn't recommend the shortest route sometimes. tries to unselect the long option, doesnt allow for customisation of route."* — S2_I003
- *"Good - able to find locations easily, bad- orientation of map is presented in a way not according to vehicle's driving direction"* — S2_I004
- Personas: full-time workers, part-time students, business owner 3:30am–11pm — time is the scarcest resource

**What this means for UI:**
- Route comparison must show **time + distance + traffic condition** simultaneously — no switching tabs to compare
- Rerouting must be **non-silent**: show a non-modal `RerouteAlert` banner with old vs new ETA delta
- Map orientation must have a **"heading-up" toggle** (mock state)
- Route customisation: allow user to **drag waypoints** (mock interaction) or **exclude a route segment**

**Screens to build:**

#### `NavigationView.jsx` — Route Selection
- Top: origin → destination bar (pre-filled with mock "Home → Orchard Road")
- Route cards (max 3, Miller's Law): each shows — travel mode icon · ETA · distance · traffic level pill (Light / Moderate / Heavy) · toll indicator
- Fastest route **auto-selected** and highlighted
- "Start" CTA — large, thumb-reachable bottom position
- Secondary: "Add stop" + "Route options" — collapsed behind chevron (Hick's Law)

#### `TurnByTurn.jsx`
- Mock step-by-step instructions panel
- Current step prominent (large type, direction arrow icon)
- Next step shown smaller below
- Bottom strip: remaining distance · ETA · "Exit Navigation" — no clutter
- `RerouteAlert` component: slides in from top as a non-modal banner — "Faster route found: saves 4 min. Take it?" → [Yes] [Stay on route] — auto-dismisses in 8s

#### `RouteCompare.jsx`
- Side-by-side card comparison of 2 route options (map + stats)
- Tappable to select — selected state clearly highlighted

#### States required:
- **Loading**: "Calculating routes…" with animated path on mock map
- **Error**: "Couldn't calculate route. Check connection or try a different destination." — inline, non-modal
- **Empty** (no routes found): "No routes available for this combination. Try adjusting your travel mode."

---

### CLUSTER 3 — Saved Places & Re-entry Orientation
**Validated from 14 interview quotes**

**Core pain point (re-entry):** Infrequent users can't re-orient — no clear starting point, recent context is lost, map defaults to unhelpful state.

**Verbatim user signals driving design:**
- *"Bad- doesn't recommend the shortest route sometimes… choices they recommend are not the fastest."* — S2_I003
- *"Good - able to find locations easily, bad- orientation of map is presented in a way not according to vehicle's driving direction"* — S2_I004
- Persona: Mechanical engineer — values precision, control, spatial accuracy

**What this means for UI:**
- Home screen must **surface recent searches immediately** — no blank map on load
- **Contextual time-of-day prompts**: morning → "Head to work?", evening → "Heading home?", weekend → "Explore nearby?"
- Saved lists must be **visually browsable** with cover image from top saved place

**Screens to build:**

#### `HomeView.jsx`
- Greeting strip: time-of-day contextual prompt (mock clock logic) — max 1 CTA
- `RecentSearches` row: last 4 searches as chips (scrollable, max 5 visible)
- Pinned routes: "Work" + "Home" as quick-launch cards (mock)
- Saved lists preview: 2 list cards visible, "See all" → SavedView
- Map: centred on mock user location, nearby pins pre-loaded

#### `SavedView.jsx`
- Tab bar: "Lists" · "Places" · "Visited"
- `SavedLists`: grid of list cards — cover photo (first place in list) · list name · item count · last updated
- `ListDetail`: places within a list — card per place with name, address, your note, remove option
- `SavePlaceSheet`: bottom sheet triggered from any place card — "Add to list" picker (existing lists + "New list")
- New list creation: inline text input inside sheet — no modal, no page navigation

#### States required:
- **Empty list**: "Nothing saved yet. Tap the bookmark icon on any place to save it here." + shortcut to search
- **Empty visited**: "Places you visit will appear here."
- **Error**: "Couldn't load your saved places." with retry

---

### CLUSTER 4 — Unable to Find Preferred Restaurant Choice
**New validated pain point — integrated from user behaviour patterns across sessions**

**Core pain point:** Users repeatedly fail to land on a restaurant that matches their actual preferences — not because filters fail, but because the app has no model of *who they are* as an eater. They scroll, second-guess, and abandon. The problem is not missing filters; it is the absence of personalisation and decision support at the point of choice.

**Verbatim user signals driving design:**
- *"ah let me see opens up restaurant tab and stares at it and scrolls excessively. he is thinking about what he wants to eat (something not heavy, healthy, and nearby) and then finds it."* — S1_I003 *(indecision is the symptom — no preference signal to anchor on)*
- *"clicked on restaurant tab, toggled at various locations on map, clicked on each location provided. looked at ratings, reviews and photos to decide which restaurant."* — S2_I006 *(manual triangulation across multiple signals — the app should do this work)*
- *"searches in the main tab vegetarian restaurants… suggestions are wrong (non-veg options presented)"* — S1_I004 *(preference is known to the user but invisible to the system)*

**Root causes identified:**
1. **No preference memory** — the app treats every session as if the user has no history
2. **No decision scaffolding** — results are a list, not a ranked recommendation
3. **Wrong signal weighting** — ratings + distance shown, but dietary fit / cuisine match / ambience preference are not
4. **No "why this" transparency** — users can't tell why a result appeared, so they distrust it and keep scrolling
5. **No fallback path** — when nothing matches, the empty state is a dead end

**What this means for UI:**

- **Taste Profile** — a lightweight, editable preference model built from: past saves, past navigations, explicit setup (optional onboarding, max 3 questions)
- **Preference Match Score** — each restaurant card shows a match signal ("Great for you" / "Might suit you" / no badge) based on dietary alignment + cuisine history + ambience + price range
- **"Help me decide" mode** — a guided 3-question flow (What are you in the mood for? How hungry? Solo or group?) that dynamically reranks the list — resolves indecision without overwhelming with options (Hick's Law)
- **"Why this place?" tooltip** — tap the match badge to see: "Matches: vegetarian · quiet · under $20 · 0.4km away"
- **Smart fallback** — when no result matches all preferences, show: "Nothing ticks every box — here's the closest match" with a reason + "Adjust one filter" shortcut

**Screens to build:**

#### `RestaurantView.jsx` — Preference-Aware Restaurant Finding
- Top: "Find me a restaurant" header with `TasteProfilePanel` accessible via profile icon
- Default state: results pre-filtered and ranked by preference match (not just distance/rating)
- `PreferenceMatchBadge` on each `RestaurantCard`: colour-coded — teal (strong match) / amber (partial) / none shown (no match, deprioritised to bottom of list)
- "Help me decide" floating button (bottom right) → triggers `DecisionFlowSheet`

#### `DecisionFlowSheet.jsx`
A 3-step bottom sheet — one question per step, max 4 answer options each (Miller's Law):
- Step 1: "What are you in the mood for?" → [Something light] [Comfort food] [Healthy] [Surprise me]
- Step 2: "How long do you have?" → [Under 30 min] [Relaxed meal] [Doesn't matter]
- Step 3: "Who's joining you?" → [Just me] [Partner] [Friends] [Family]
- Result: list reranks in real time as answers are given — user sees results updating behind the sheet (progressive disclosure of outcome)
- "Reset answers" link at bottom — no confirmation needed

#### `TasteProfilePanel.jsx`
- Accessible from profile icon in `RestaurantView` top bar
- Sections: Dietary preferences (multiselect) · Favourite cuisines (up to 5, drag to reorder) · Usual price range (segmented control) · Preferred ambience (icon tiles)
- Changes persist to `userPreferences.json` mock state via `PreferenceContext`
- "Your profile influences restaurant rankings" — one-line explainer, always visible

#### `PreferenceMatchBadge.jsx`
- Teal pill: "Great for you" — shown when ≥3 preference signals match
- Amber pill: "Might suit you" — shown when 1–2 signals match
- No badge: 0 matches — card appears but is visually deprioritised (reduced opacity, placed lower in list)
- Tap badge → tooltip overlay: "Matches: [vegetarian] [quiet] [$–$$]" — dismiss on tap outside

#### `NoMatchFallback.jsx`
Triggered when 0 results match all active preferences:
- Headline: "Nothing ticks every box right now"
- Subtext: "Here's the closest match — and what doesn't quite fit"
- Shows 1 best-effort card with mismatch reason ("Open until 10pm · not vegetarian · 1.2km")
- Two CTA buttons: "Adjust one filter" (opens FilterPanel to least-restrictive filter) · "Show all nearby" (clears preference ranking, shows raw distance sort)
- Never a dead end — always a forward path

#### States required:
- **Loading**: "Finding places that match your taste…" — skeleton cards with preference badge placeholders
- **Empty (no restaurants at all nearby)**: "No restaurants found within 2km. Try expanding your search area." + distance slider shortcut
- **Empty (preference mismatch)**: `NoMatchFallback` — see above, never a blank list
- **Error**: inline banner "Couldn't load restaurants. Check your connection." + retry — no modal
- **Taste profile not set**: `RestaurantView` defaults to distance + rating sort, with a dismissable prompt strip: "Set your taste preferences for better recommendations" → opens `TasteProfilePanel`

---

## 5. Mock Data Specs

### `/src/data/places.json`
Generate 50 entries. Each entry must include all fields below — `tags` and `avgMealDuration` are new additions required by Cluster 4's `DecisionFlowSheet` mood-matching logic:
```json
{
  "id": "place_001",
  "name": "The Vegetarian Kitchen",
  "cuisine": "Asian Fusion",
  "dietary": ["vegetarian", "vegan"],
  "price": 2,
  "rating": 4.3,
  "reviewCount": 812,
  "distance": 0.4,
  "busyness": 65,
  "openNow": true,
  "ambience": ["casual", "quiet"],
  "address": "12 Orchard Link, Singapore",
  "lat": 1.3041,
  "lng": 103.8318,
  "photo": "https://picsum.photos/seed/place001/400/300",
  "tags": ["healthy", "light", "solo-friendly"],
  "avgMealDuration": 30
}
```

**Required distributions across 50 entries:**
- Dietary: ~15 vegetarian · ~8 vegan · ~12 halal · ~10 gluten-free · ~15 none
- Tags (for mood matching): include at least 8 entries each of `light` / `comfort` / `healthy` / `group-friendly` / `solo-friendly`
- Ambience: distribute across `casual` · `quiet` · `romantic` · `family` — no single value on more than 20 entries
- `avgMealDuration`: range from 15 (hawker / fast casual) to 90 (fine dining)

### `/src/data/userPreferences.json`
Mock user preference profile. Consumed by `PreferenceContext` to compute `PreferenceMatchBadge` state and seed `TasteProfilePanel` initial values:
```json
{
  "dietary": ["vegetarian"],
  "cuisines": ["Japanese", "Mediterranean", "Indian"],
  "priceRange": [1, 2],
  "ambience": ["quiet", "casual"],
  "pastPlaceIds": ["place_003", "place_017", "place_022"],
  "profileComplete": true
}
```
- `profileComplete: false` triggers the onboarding prompt strip in `RestaurantView`
- `pastPlaceIds` used to infer implicit preferences (cuisine from saved places, not just explicit selections)

### `/src/data/savedLists.json`
```json
[
  {
    "id": "list_001",
    "name": "Date Night",
    "placeIds": ["place_003", "place_017", "place_031"],
    "coverPhoto": "https://picsum.photos/seed/list001/600/400"
  }
]
```

### `/src/data/routes.json`
3 route objects between "Home (Bedok)" → "Orchard Road":
```json
{
  "id": "route_001",
  "label": "Fastest",
  "mode": "driving",
  "eta": 22,
  "distance": 14.2,
  "traffic": "moderate",
  "hasToll": true,
  "steps": [
    { "instruction": "Head west on Bedok North Ave 1", "distance": "200m", "icon": "arrow-right" },
    { "instruction": "Merge onto PIE", "distance": "10.1km", "icon": "arrow-right" }
  ]
}
```

---

## 6. Visual Design System

### Palette (CSS variables in `index.css`)
```css
:root {
  --color-bg: #F7F6F3;           /* warm off-white — not pure white */
  --color-surface: #FFFFFF;
  --color-surface-raised: #EFEFED;
  --color-primary: #1A6B4A;      /* deep green — calm, focused */
  --color-primary-light: #E8F5EE;
  --color-accent: #E85D26;       /* warm orange — CTAs, alerts */
  --color-text-primary: #141414;
  --color-text-secondary: #6B6B6B;
  --color-text-muted: #ABABAB;
  --color-border: #E2E1DE;
  --color-error: #CC2B2B;
  --color-warning: #D97706;
  --color-success: #1A6B4A;
}
```

### Typography
```css
/* In index.html <head> */
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

/* Usage */
.heading   { font-family: 'Syne', sans-serif; font-weight: 700; }
.body      { font-family: 'DM Sans', sans-serif; font-weight: 400; }
.label     { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; }
```

### Component Tokens
- Border radius: cards `12px`, chips `999px`, buttons `8px`
- Shadows: `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)`
- Transitions: `200ms ease` for state changes, `300ms ease` for panel open/close
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48px

---

## 7. Interaction Patterns

### Bottom Sheet (shared)
- Used for: place detail, save to list, route options on mobile
- Drag handle visible
- Snap points: 40% / 75% / 95% of viewport height
- Dismiss: drag down or tap overlay

### Filter Panel
- Desktop: persistent left sidebar
- Mobile: slides up as bottom sheet from "Filters" button
- Active filter count shown on button badge
- "Clear all" resets to defaults — no confirmation needed

### Non-modal Error Handling (all views)
- Inline `ErrorBanner` component: slides down from top of content area
- Contains: icon + message + retry button
- Auto-dismisses after 5s if resolved, persists if not
- Never blocks content behind a modal overlay

### Map Pins
- Default: `--color-primary` filled circle with white icon
- Selected: larger, drop shadow, label card appears
- Dietary match: green (full) / amber (partial) / grey (none)
- Clustered: number badge when >3 pins overlap

---

## 8. Build Order (follow this sequence)

1. **Scaffold** — Vite + React + Tailwind + Router setup
2. **Mock data** — Write all JSON files first (places, savedLists, routes, userPreferences)
3. **Design system** — `index.css` variables, font imports, shared tokens
4. **Shared components** — `EmptyState`, `ErrorBanner`, `LoadingSkeleton`, `FilterChip`, `BottomSheet`
5. **MapCanvas** — SVG mock map with basic pin rendering from context
6. **AppShell** — TopBar + Sidebar + MapCanvas layout
7. **HomeView** — Cluster 3 re-entry screen (contextual prompts, recent searches)
8. **SearchView** — Cluster 1 discovery + FilterPanel + RestaurantCard + results list
9. **PreferenceContext** — build preference scoring logic before RestaurantView
10. **RestaurantView** — Cluster 4: TasteProfilePanel + PreferenceMatchBadge + DecisionFlowSheet + NoMatchFallback
11. **NavigationView** — Cluster 2 route compare + turn-by-turn + RerouteAlert
12. **SavedView** — Cluster 3 saved lists + places + SavePlaceSheet
13. **Wire views together** — React Router, tab navigation, context handoff
14. **Polish** — Framer Motion transitions, all empty/loading/error states, responsive layout

---

## 9. Accessibility Requirements (WCAG 2.2 AA)

- All interactive elements: min 44×44px touch target
- Colour contrast: all text ≥ 4.5:1 against background
- Focus rings: visible on all keyboard-focusable elements (`outline: 2px solid var(--color-primary)`)
- `aria-label` on all icon-only buttons
- `role="status"` on loading states for screen reader announcement
- Error messages: associated with triggering element via `aria-describedby`
- Filter chips: use `role="checkbox"` + `aria-checked` for multiselect groups

---

## 10. Key Constraints & Decisions

| Decision | Rationale |
|---|---|
| No Google Maps API | Prototype focus — validate UX before API costs |
| SVG mock map | Controllable, no tile loading, no API key |
| Framer Motion | Bottom sheet + page transitions are central to the UX — CSS alone is insufficient |
| Context over Redux | State complexity doesn't justify Redux; 4 context providers is the ceiling |
| JSON mock data | Deterministic — no async uncertainty during dev |
| picsum.photos for images | Stable, seed-based, free, no auth |
| Max 5 items per filter group (visible) | Miller's Law — enforced at data level, not just design |
| PreferenceContext separate from FilterContext | Preference matching (who the user is) is a different concern from active filter state (what they're searching for right now) — keep them decoupled |
| DecisionFlowSheet max 4 options per step | Miller's Law strictly applied — indecision is the core pain point, so option overload is the failure mode to prevent |
| NoMatchFallback always shows 1 result | Dead-end empty states are the exact problem Cluster 4 is solving — there is always a forward path |

---

## 11. Definition of Done

A screen is complete when it has:
- [ ] Happy path fully interactive with mock data
- [ ] Empty state with descriptive copy + shortcut action
- [ ] Loading skeleton (min 300ms simulated delay for realism)
- [ ] Non-modal error state with retry
- [ ] Passes WCAG 2.2 AA contrast check
- [ ] Works at 375px (mobile) and 1280px (desktop) widths
- [ ] All filter state changes reflected on map pins in real time

`RestaurantView` additionally requires:
- [ ] `PreferenceMatchBadge` renders correctly for strong / partial / no match
- [ ] `DecisionFlowSheet` reranks list in real time as each answer is selected
- [ ] `NoMatchFallback` shown (never blank list) when 0 results match all preferences
- [ ] `TasteProfilePanel` changes persist to `PreferenceContext` and immediately update badge states
- [ ] Taste profile not set → onboarding prompt strip visible, results fall back to distance + rating sort
