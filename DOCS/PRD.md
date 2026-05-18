# PRD - Photo Memory Map

## 1. Product Summary

Photo Memory Map is a private memory map for two people. It helps a couple save shared memories with photos, videos, notes, dates, moods, categories, and locations, then revisit them through a map-first interface, a photo library, and a shared profile space. It can also support optional live location sharing so each person can see where the other person is on the same private map when sharing is enabled.

The current project is a Next.js App Router prototype using JavaScript/JSX, Leaflet, React Aria, StyleX/CSS, and mock memory data. The product direction should stay close to what the app already does:

> Open the private map, browse memories by place, filter them, preview media, open details, add a new memory, and optionally see each other live on the map when location sharing is turned on.

The product is not a social network. There are no public feeds, follows, likes, comments, or public discovery mechanics.

Live location sharing is not a public tracking feature. It is an explicit, opt-in couple safety/presence feature between the two people in the same private space.

---

## 2. Current Product Shape

### 2.1. Existing Routes

| Route | Current purpose |
| --- | --- |
| `/` | Map-first home experience using `features/map` |
| `/checkins` | Memory library/gallery using `features/memory` |
| `/checkins/[id]` | Full memory detail page |
| `/profile` | Couple space/profile overview |

### 2.2. Current Feature Ownership

| Area | Owner |
| --- | --- |
| Map, markers, clustering, map controls, category filter | `features/map` |
| Memory library, cards, detail drawer/page, media viewer, add-memory drawer/form | `features/memory` |
| Couple profile and stats | `features/profile` |
| Live location sharing UI and map presence | Future `features/location-sharing` or `features/map` integration |
| Mock couple space, categories, moods, checkins, formatters | `entities/memory` |
| Generic layout, UI primitives, styles, helper utilities | `shared` |

### 2.3. Current Data State

The app currently uses mock data from `entities/memory/mock-data.js`.

There is no production backend, database persistence, authentication, real upload storage, or API layer yet. Forms and drawers should be treated as prototype UI unless persistence is added.

---

## 3. Product Vision

Create a warm, private place where two people can revisit their shared journey through locations and media.

When live location sharing is enabled, the product should also create a gentle sense of presence: "I can see where you are now" without making the app feel like surveillance.

The app should feel:

- Private
- Personal
- Photo-first
- Map-first
- Presence-aware when both people opt in
- Warm but not childish
- Simple enough to use often
- Clearly different from public social media

Positioning statement:

> A private memory map for two people, where shared moments become places, photos, and stories to revisit together.

---

## 4. Target Users

The product is designed for exactly two people sharing one private couple space.

| User | Role |
| --- | --- |
| Person 1 | View, add, edit, and delete shared memories |
| Person 2 | View, add, edit, and delete shared memories |

Not included:

- Public users
- Followers
- Public profiles
- Public feeds
- Place discovery communities
- Review or booking users

---

## 5. Core Problems

Shared memories are usually scattered across phone galleries, chat apps, map links, and vague recollections. Over time, it becomes hard to remember where something happened, when it happened, and what photos or videos belonged to that moment.

Photo Memory Map solves this by grouping:

- Media
- Date
- Note/caption
- Mood
- Category
- Location
- Couple context

into one private memory system.

For couples who want more real-time presence, the product also solves:

- "Where are you now?" without needing to ask repeatedly.
- Seeing whether the other person is moving or staying in one place.
- Coordinating meetups by looking at both people on the same private map.
- Reducing uncertainty while still making location sharing explicit and controllable.

---

## 6. MVP Scope

The MVP should focus on the experience already being built:

> Browse memories on a map and in a gallery, open details, and create a new memory with media and location fields.

### 6.1. In Scope For The Current MVP

| Feature | Status | Notes |
| --- | --- | --- |
| Map-first home page | Implemented prototype | Leaflet map with memory markers |
| Marker clustering | Implemented prototype | Uses marker cluster behavior |
| Category filtering on map | Implemented prototype | Filter by memory category |
| Hover preview on map marker | Implemented prototype | Opens memory preview tooltip |
| Detail drawer from map | Implemented prototype | Opens selected memory without leaving map |
| Add-memory drawer | Implemented prototype | UI exists; persistence not implemented |
| Memory library | Implemented prototype | Search, category filter, mood filter, sort |
| Memory detail page | Implemented prototype | Media gallery, metadata, related memories |
| Photo/video media viewer | Implemented prototype | Media support exists in mock data/UI |
| Couple profile page | Implemented prototype | Couple info, stats, milestones |
| Mock data model | Implemented prototype | Stored in `entities/memory` |
| Live location marker for each person | Planned | Needed for iOS/native phase or realtime backend phase |
| Moving location state | Planned | Needed for live sharing experience |

### 6.2. Not Yet Implemented

| Feature | MVP decision |
| --- | --- |
| Authentication | Future backend phase |
| Real database persistence | Future backend phase |
| Real upload storage | Future backend phase |
| Create/update/delete APIs | Future backend phase |
| Location search API | Future enhancement |
| GPS current-location save | Future enhancement |
| Live location sharing | Future realtime/native phase |
| Background location updates on iOS | Future iOS phase |
| Settings page | Future enhancement |
| Public sharing | Out of scope |
| Like/comment/follow/feed | Out of scope |
| Chat | Out of scope |

---

## 7. Key Product Requirements

### 7.1. MAP-001 - Memory Map

Goal: make the map the primary way to revisit memories by place.

Requirements:

- Show all memories with valid coordinates as markers.
- Cluster nearby markers when useful.
- Keep home/private locations readable and not lost inside clusters when product needs it.
- Let users filter map memories by category.
- Show adaptive place labels when zoomed in enough.
- Avoid label overlap where possible.
- Show a hover preview with cover media and summary.
- Open a memory detail drawer when a marker or preview is selected.
- Provide a clear add-memory action from the map controls.
- Keep the map responsive on desktop and mobile.

Current implementation notes:

- Uses Leaflet/OpenStreetMap tiles.
- Uses `react-leaflet` and marker clustering.
- Uses category filtering from mock memory data.

### 7.2. LOCATION-001 - Live Location Sharing

Goal: let either person share their current location with the other person inside the private couple map.

Requirements:

- Each person can turn location sharing on or off.
- Location sharing must be opt-in and visible in the UI.
- If only Person 1 is sharing, only Person 1's live marker appears.
- If only Person 2 is sharing, only Person 2's live marker appears.
- If both people are sharing, both live markers appear at the same time.
- Live markers must be visually distinct from memory pins.
- A live marker should use the person's avatar, initials, or a clear "current person" style.
- A live marker should show the person's display name.
- A live marker should show last updated time, for example "updated 20 seconds ago".
- A live marker should show status: active, stale, paused, or unavailable.
- Tapping a live marker should open a compact person/location card.
- The map should offer a "center on partner" action when the partner is sharing.
- The map should offer a "center on both of us" action when both people are sharing.

Non-goals:

- Do not show location to anyone outside the couple space.
- Do not create public location links.
- Do not store detailed location history in MVP unless explicitly added later.
- Do not make location sharing invisible or hard to stop.

### 7.3. LOCATION-002 - Movement On Map

Goal: when a sharing person moves, the other person should see that movement reflected on the map.

Requirements:

- The live marker should update when new coordinates arrive.
- Marker movement should animate smoothly enough to feel alive, not jumpy.
- The UI should indicate movement when the person is moving.
- Movement state can be inferred from recent coordinate changes, speed, or heading when available.
- If heading is available, the marker may show direction.
- If speed is available, the location card may show "moving" versus "stopped"; avoid showing overly precise speed unless useful.
- If updates stop arriving, the marker should become stale after a defined timeout.
- If the person turns sharing off, remove or pause their live marker immediately.

Suggested realtime states:

| State | Meaning |
| --- | --- |
| `active` | Recent location update received |
| `moving` | Recent updates show meaningful movement |
| `stationary` | Recent updates show no meaningful movement |
| `stale` | Last update is older than the allowed freshness window |
| `paused` | User intentionally turned sharing off |
| `unavailable` | Permission/network/device state prevents sharing |

Suggested update behavior:

- Foreground app: update every 5-15 seconds or on meaningful location change.
- Background iOS app: update using iOS location capabilities and battery-aware significant changes where possible.
- Realtime delivery: use WebSocket, realtime database subscriptions, or push-assisted refresh.
- UI freshness timeout: mark as stale after 60-120 seconds without updates.
- Hard privacy expiry: optionally stop a sharing session after a selected duration.

### 7.4. MEMORY-001 - Memory Library

Goal: provide a gallery/list view for browsing all saved memories.

Requirements:

- Show all memories as media-first cards.
- Support search by title, location name, or city.
- Support category filter.
- Support mood filter.
- Support newest/oldest sorting.
- Show a summary count for the current filtered result.
- Open the full detail page from a memory card.
- Empty and filtered-empty states should guide the user gently.

### 7.5. MEMORY-002 - Add Memory

Goal: make adding a memory feel quick, visual, and not overloaded.

Current prototype fields:

| Field | Required in current UI | Notes |
| --- | ---: | --- |
| Title | Yes | Main memory title |
| Short journal/note | No | Text area plus writing prompts |
| Media | Yes in current mock form | Image/video local preview only |
| Place name | Yes in current mock form | Should become optional later if desired |
| Address | No | Free text |
| Coordinates | No | Free text in prototype |
| Google Maps URL | No | Useful for manual location capture |
| Category | Yes | Select from mock categories |
| Mood | Yes | Select from mock moods |
| Memory date | Yes | Date field |
| Visibility | Yes | Private or draft in UI |

MVP behavior target:

- The form should preview selected images/videos locally.
- Removing a selected media item should revoke the local preview URL.
- Submitting should be blocked until required fields are valid.
- Until backend exists, submission may remain prototype-only.
- Once backend exists, successful submit should create a memory and show it on the map/library.

### 7.6. MEMORY-003 - Memory Detail

Goal: show the full story behind one memory.

Requirements:

- Show photo/video gallery.
- Show title, caption/note, location, address, date, creator, category, and mood.
- Show a small map/location representation when coordinates exist.
- Link back to the map.
- Show related memories.
- Provide edit/delete actions as UI affordances, even if backend behavior is added later.

### 7.7. PROFILE-001 - Couple Space

Goal: summarize the shared private space.

Requirements:

- Show couple space name and cover image.
- Show both people.
- Show journey start date.
- Show stats: memories, places, photos, days together.
- Show milestone memories.
- Show recent memories.
- Keep the page private, warm, and low-noise.

---

## 8. Data Model Direction

The current mock data should guide the first backend schema.

### 8.1. CoupleSpace

| Field | Meaning |
| --- | --- |
| `id` | Couple space ID |
| `name` | Short couple name |
| `spaceName` | Display name for the shared space |
| `coverImage` | Cover image URL |
| `startDate` | Journey start date |
| `people` | Two people in the space |
| `bio` | Short description |
| `stats` | Derived or cached stats |

### 8.2. LiveLocationSession

| Field | Meaning |
| --- | --- |
| `id` | Sharing session ID |
| `coupleSpaceId` | Couple space ID |
| `userId` | Person who is sharing |
| `status` | `active`, `paused`, or `ended` |
| `startedAt` | When sharing started |
| `endedAt` | When sharing ended |
| `expiresAt` | Optional automatic stop time |
| `lastLocationId` | Latest location update reference |
| `createdAt` | Created timestamp |
| `updatedAt` | Updated timestamp |

### 8.3. LiveLocationUpdate

| Field | Meaning |
| --- | --- |
| `id` | Location update ID |
| `sessionId` | Sharing session reference |
| `coupleSpaceId` | Couple space ID |
| `userId` | Person who sent the update |
| `latitude` | Current latitude |
| `longitude` | Current longitude |
| `accuracyMeters` | Location accuracy if available |
| `heading` | Direction if available |
| `speedMetersPerSecond` | Speed if available |
| `batteryState` | Optional coarse battery state |
| `recordedAt` | Device timestamp |
| `receivedAt` | Server timestamp |

Retention rule:

- MVP should store only the latest location per active user or a very short rolling window for movement smoothing.
- Long-term location history should be off by default and require a separate product decision.

### 8.4. Memory / Checkin

| Field | Meaning |
| --- | --- |
| `id` | Memory ID |
| `title` | Memory title |
| `caption` | Short note/caption |
| `locationName` | Place name |
| `address` | Address text |
| `googleMapsUrl` | Optional Google Maps link |
| `city` | City/grouping label |
| `latitude` | Latitude |
| `longitude` | Longitude |
| `categoryId` | Category reference |
| `moodId` | Mood reference |
| `visibility` | Private/draft state |
| `checkinTime` | Memory date/time |
| `createdBy` | Display name or user reference |
| `images` | Simple image URLs |
| `media` | Rich media objects for images/videos |
| `mapPosition` | Legacy/static mini-map position helper |

### 8.5. Category

| Field | Meaning |
| --- | --- |
| `id` | Category ID |
| `name` | Display name |
| `slug` | Stable slug |
| `icon` | Icon label/name |
| `color` | Category color |

### 8.6. Mood

| Field | Meaning |
| --- | --- |
| `id` | Mood ID |
| `name` | Display name |
| `slug` | Stable slug |
| `icon` | Icon label/name |

---

## 9. UX Principles

- Map-first, but not travel-app-first. The map is for remembering, not public discovery.
- Photo-first cards and previews should make the app feel personal immediately.
- Keep actions obvious: add memory, open detail, return to map, filter.
- Keep live location controls obvious: start sharing, stop sharing, center on partner.
- Avoid social-media patterns such as public engagement counters.
- Avoid surveillance patterns: no hidden sharing, no public sharing, no permanent history by default.
- Mobile must stay usable, especially drawers, filters, and media previews.
- Labels, markers, and cards should not visually collide or feel noisy.
- Empty states should encourage adding the first memory.
- Do not ask for more information than needed to save a meaningful memory.

---

## 10. Technical Requirements

The implementation must follow the repository architecture:

- Next.js App Router.
- JavaScript/JSX only unless a migration is explicitly requested.
- No `src/` directory.
- Feature-based structure:
  - `app/` for thin routes.
  - `features/` for business feature UI/logic.
  - `entities/` for shared domain data/helpers.
  - `shared/` for generic UI/helpers/styles.
- Cross-feature imports must go through feature public APIs.
- Route files should compose feature page components only.

Current stack:

- Next.js 16
- React 19
- Leaflet / React Leaflet
- React Aria / React Aria Components
- OverlayScrollbars
- StyleX and CSS partials
- Mock data in JavaScript modules

Do not rewrite the app toward TypeScript, Tailwind, Prisma, Supabase, or another stack unless that is a deliberate project decision.

For an iOS/native companion app, the product should use native location APIs for foreground and background location updates, request permission with clear copy, and respect iOS background-location indicators and permission controls.

---

## 11. Backend Phase Requirements

When persistence is introduced, add it without breaking the current feature boundaries.

Required backend capabilities:

- Authentication for the two-person space.
- Couple space membership checks.
- Create memory.
- Update memory.
- Delete memory.
- Fetch memory by ID.
- Fetch memories for the current couple space.
- Fetch map memories with coordinates.
- Upload image/video media.
- Delete media.
- Set cover media.
- Start live location sharing.
- Stop live location sharing.
- Receive live location updates.
- Broadcast partner location updates to the other person.
- Mark stale/unavailable live locations when updates stop.

Security requirements:

- Every memory query must be scoped to the current couple space.
- Users outside the couple space must not access memory data.
- Uploaded media must be private or served through signed/authorized access.
- Location permission must only be requested after explicit user action.
- Live location sharing must be explicit opt-in per person.
- Each person must be able to stop sharing at any time.
- The app must show when sharing is active.
- Live location data must be scoped to the couple space.
- Live location history should not be retained by default.
- If retention is needed for debugging, use short retention and avoid exposing it as a user-facing history.

---

## 12. Acceptance Criteria For The Current Prototype

The current prototype is acceptable when:

1. `/` loads the map without server-side Leaflet errors.
2. Memory markers render from mock data.
3. Category filtering updates visible markers.
4. Marker hover shows a memory preview.
5. Selecting a marker opens the memory detail drawer.
6. The add-memory drawer opens from the map control.
7. Local media preview works in the add-memory form.
8. `/checkins` shows the memory library.
9. Library search, category filter, mood filter, and sort work.
10. `/checkins/[id]` shows a valid memory detail page.
11. Unknown memory IDs return Next.js `notFound`.
12. `/profile` shows the couple space overview.
13. The UI remains usable on mobile and desktop.

## 13. Acceptance Criteria For Live Location

The live location feature is acceptable when:

1. Person 1 can turn location sharing on and Person 2 sees Person 1 on the map.
2. Person 2 can turn location sharing on and Person 1 sees Person 2 on the map.
3. If both people share, both live markers are visible at the same time.
4. Live markers are visually different from memory pins.
5. A live marker updates position when new coordinates arrive.
6. Movement is visible through smooth marker updates or a clear moving state.
7. The marker shows last updated time.
8. Stale updates are marked clearly after the freshness timeout.
9. Stopping sharing removes or pauses the live marker for the other person.
10. The app never shares location before the user explicitly enables it.
11. Location updates are only visible inside the correct couple space.
12. The iOS app remains battery-aware and does not request excessive background updates.

---

## 14. iOS App Direction

The iOS app should be a companion-first experience for live presence and quick memory capture.

Core iOS tabs:

| Tab | Purpose |
| --- | --- |
| Map | Memory pins plus live partner location |
| Add | Quick photo/video memory capture |
| Library | Browse saved memories |
| Us | Couple space/profile and sharing status |

Map requirements on iOS:

- Show memory pins and live person markers together.
- Use different visual systems for memory pins and live markers.
- Provide a prominent share-location toggle.
- Provide quick actions: "Center on me", "Center on partner", and "Show both".
- Show permission and sharing status clearly.
- If partner is moving, animate their marker and show "moving now" or similar copy.
- If partner's location is stale, show the last known time instead of pretending it is live.

iOS permission requirements:

- Ask for location permission only when the user turns sharing on.
- Explain why the app needs location before the system prompt.
- Support foreground sharing first.
- Add background sharing only when the product is ready to handle battery, privacy, and iOS review expectations.
- Show an in-app active sharing indicator whenever sharing is on.

Recommended native implementation direction:

- Use SwiftUI for the app shell.
- Use MapKit for the iOS map.
- Use Core Location for device location.
- Use a realtime backend channel for partner updates.
- Use push notifications only for supportive events, not as the main location stream.
- Keep the web app and iOS app aligned around the same backend model: couple space, memories, media, live location session, latest location update.

---

## 15. Roadmap

### Phase 1 - Stabilize Prototype

- Polish map marker, cluster, label, and drawer behavior.
- Finalize memory library filtering and empty states.
- Make the add-memory prototype form consistent with the final data model.
- Improve responsive behavior for map, drawers, gallery, and profile.
- Clean mock data so images/videos match memory content more closely.

### Phase 2 - Real MVP Persistence

- Add authentication and couple-space access control.
- Add database-backed memories.
- Add media upload/storage.
- Wire add-memory form to real create behavior.
- Add edit/delete behavior.
- Replace mock stats with computed real stats.

### Phase 3 - Live Location MVP

- Add live location sharing sessions.
- Add latest-location storage scoped by couple space.
- Add live person markers on the map.
- Add start/stop sharing controls.
- Add stale/paused/unavailable states.
- Add realtime delivery for partner location updates.
- Add iOS foreground sharing.
- Add battery-aware iOS background sharing only after foreground behavior is stable.

### Phase 4 - Memory Experience

- Timeline by month/year.
- Better place grouping.
- More useful related memories.
- Recaps by year or place.
- Draft memories.
- Optional tags.
- Better location picking/search.

### Phase 5 - Personalization And Archive

- Couple themes.
- Export album/PDF.
- Backup/archive flows.
- Private share links only if explicitly desired later.

---

## 16. Explicitly Out Of Scope

Do not build these unless the product direction changes:

- Public feed
- Follow system
- Public profiles
- Likes/comments
- Chat
- Place review system
- Booking or trip planning marketplace
- Public discovery
- Public live location links
- Hidden location tracking
- Permanent live location history by default
- Multi-couple community
- Complex AI features
- Ads or monetized social mechanics

---

## 17. Success Metrics

Because this is a private product for two people, success should measure meaningful usage, not social growth.

| Area | Metric |
| --- | --- |
| Content creation | Number of memories created |
| Media | Number of photos/videos added |
| Map value | Percentage of memories with coordinates |
| Revisiting | Memory detail opens per week |
| Browse quality | Library searches/filters used |
| Couple journey | Number of unique places saved |
| Retention | Weekly return visits by the two users |
| Data quality | Memories with title, date, media, and location |
| Live sharing | Number of intentional sharing sessions |
| Live freshness | Percentage of active sessions with fresh latest location |
| Presence value | Partner marker opens or center-on-partner actions |

---

## 18. Product Conclusion

Photo Memory Map should stay focused: a private, visual, map-based memory space for two people.

The current project is already strongest when it behaves like a living memory atlas: open the map, see the places, hover a pin, revisit a photo, and open the full story. Live location sharing can extend that map into a gentle real-time presence layer, but it must stay explicit, private, reversible, and clearly separate from saved memory pins.
