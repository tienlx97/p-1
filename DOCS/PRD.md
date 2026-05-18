# PRD - Photo Memory Map

## 1. Product Summary

Photo Memory Map is a private memory map for two people. It helps a couple save shared memories with photos, videos, notes, dates, moods, categories, and locations, then revisit them through a map-first interface, a photo library, and a shared profile space.

The current project is a Next.js App Router prototype using JavaScript/JSX, Leaflet, React Aria, StyleX/CSS, and mock memory data. The product direction should stay close to what the app already does:

> Open the private map, browse memories by place, filter them, preview media, open details, and add a new memory through a focused drawer/form.

The product is not a social network. There are no public feeds, follows, likes, comments, or public discovery mechanics.

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
| Mock couple space, categories, moods, checkins, formatters | `entities/memory` |
| Generic layout, UI primitives, styles, helper utilities | `shared` |

### 2.3. Current Data State

The app currently uses mock data from `entities/memory/mock-data.js`.

There is no production backend, database persistence, authentication, real upload storage, or API layer yet. Forms and drawers should be treated as prototype UI unless persistence is added.

---

## 3. Product Vision

Create a warm, private place where two people can revisit their shared journey through locations and media.

The app should feel:

- Private
- Personal
- Photo-first
- Map-first
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

### 6.2. Not Yet Implemented

| Feature | MVP decision |
| --- | --- |
| Authentication | Future backend phase |
| Real database persistence | Future backend phase |
| Real upload storage | Future backend phase |
| Create/update/delete APIs | Future backend phase |
| Location search API | Future enhancement |
| GPS current-location save | Future enhancement |
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

### 7.2. MEMORY-001 - Memory Library

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

### 7.3. MEMORY-002 - Add Memory

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

### 7.4. MEMORY-003 - Memory Detail

Goal: show the full story behind one memory.

Requirements:

- Show photo/video gallery.
- Show title, caption/note, location, address, date, creator, category, and mood.
- Show a small map/location representation when coordinates exist.
- Link back to the map.
- Show related memories.
- Provide edit/delete actions as UI affordances, even if backend behavior is added later.

### 7.5. PROFILE-001 - Couple Space

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

### 8.2. Memory / Checkin

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

### 8.3. Category

| Field | Meaning |
| --- | --- |
| `id` | Category ID |
| `name` | Display name |
| `slug` | Stable slug |
| `icon` | Icon label/name |
| `color` | Category color |

### 8.4. Mood

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
- Avoid social-media patterns such as public engagement counters.
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

Security requirements:

- Every memory query must be scoped to the current couple space.
- Users outside the couple space must not access memory data.
- Uploaded media must be private or served through signed/authorized access.
- Location permission must only be requested after explicit user action.

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

---

## 13. Roadmap

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

### Phase 3 - Memory Experience

- Timeline by month/year.
- Better place grouping.
- More useful related memories.
- Recaps by year or place.
- Draft memories.
- Optional tags.
- Better location picking/search.

### Phase 4 - Personalization And Archive

- Couple themes.
- Export album/PDF.
- Backup/archive flows.
- Private share links only if explicitly desired later.

---

## 14. Explicitly Out Of Scope

Do not build these unless the product direction changes:

- Public feed
- Follow system
- Public profiles
- Likes/comments
- Chat
- Place review system
- Booking or trip planning marketplace
- Public discovery
- Multi-couple community
- Complex AI features
- Ads or monetized social mechanics

---

## 15. Success Metrics

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

---

## 16. Product Conclusion

Photo Memory Map should stay focused: a private, visual, map-based memory space for two people.

The current project is already strongest when it behaves like a living memory atlas: open the map, see the places, hover a pin, revisit a photo, and open the full story. The PRD should protect that direction while leaving a clear path from mock prototype to real private MVP.
