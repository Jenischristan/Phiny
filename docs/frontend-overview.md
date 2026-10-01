# Frontend Technical Architecture & Overview

## 1. Core Technology Stack

- **Runtime & Framework**: Next.js 16.3.8 (App Router, Turbopack enabled)
- **UI Library**: React 19.0.1
- **Language**: TypeScript 5.8+ configured with strict type checking and path aliases (`@/*` resolving to root)
- **Styling**: Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- **Typography**: Next.js Google Fonts (`Space Grotesk` as `--font-sans` and `IBM Plex Mono` as `--font-mono`)
- **Icons**: Lucide React (`lucide-react`) alongside customized inline SVG primitives in `components/ui/Icon.tsx`
- **Testing**: Vitest 5.0 (Node jsdom test runner) + Playwright 1.63 (browser-based E2E runner)

---

## 2. Directory & File Structure

```text
/
├── app/                             # Next.js App Router root
│   ├── api/                         # Backend API route handlers
│   │   ├── auth/login/route.ts      # Authentication endpoint
│   │   ├── collections/             # Collections endpoints (list, create)
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts        # Single collection (get, patch, delete)
│   │   └── posts/                   # Posts endpoints (list, create)
│   │       ├── route.ts
│   │       └── [id]/route.ts        # Single post (get, patch, delete)
│   ├── collection/[id]/page.tsx     # Collection detail view page
│   ├── create/page.tsx              # Post creation page
│   ├── explore/page.tsx             # Topic discovery and interest feed page
│   ├── library/page.tsx             # User library (saved posts, collections) page
│   ├── post/[id]/page.tsx           # Single post view & comments page
│   ├── profile/                     # Profile pages
│   │   ├── page.tsx                 # Own profile redirect / default view
│   │   ├── [id]/page.tsx            # Specific user profile
│   │   ├── [id]/followers/page.tsx  # User followers list
│   │   └── [id]/following/page.tsx  # User following list
│   ├── settings/page.tsx            # Account, privacy, and theme settings
│   ├── signup/page.tsx              # 9-step registration wizard
│   ├── layout.tsx                   # Root HTML layout with providers & shell
│   ├── not-found.tsx                # Custom 404 page
│   └── page.tsx                     # Home masonry feed page
├── components/                      # Modular UI component catalog
│   ├── auth/                        # Login & Account Switcher dialogs
│   ├── collections/                 # Collection views, grids, and dialogs
│   ├── feed/                        # HomeView, ExploreView, Grid, ImageCard, SearchBar, PostView, CreateView
│   ├── layout/                      # AppShell, Sidebar, Header, BottomNav
│   ├── messages/                    # MsgsSheet, Chat Bubble
│   ├── modals/                      # ConfirmDialog, ReportDialog
│   ├── notifications/               # NotifsSheet
│   ├── profile/                     # ProfileView, PeopleView, UserCard, EditProfileDialog
│   ├── settings/                    # SettingsView, AccountSet, Security
│   └── ui/                          # Button, Dialog, Field, Switch, Menu, Tabs, Avatar, Uploader, Toaster
├── context/
│   └── PhinyContext.tsx             # Global application state provider and reducer
├── data/
│   └── mockData.ts                  # Prototype seed data for posts, users, collections, and messages
├── lib/
│   ├── api.ts                       # Client-side API fetch abstraction
│   ├── art.ts                       # Procedural brutalist SVG generator
│   ├── backendData.ts               # In-memory prototype backend store (singleton)
│   ├── storage.ts                   # Safe localStorage getter/setter
│   ├── utils.ts                     # Formatting, helpers, and media query constants
│   └── validation.ts                # Client-side form validation schemas & regexes
├── types/
│   └── index.ts                     # Master TypeScript interfaces and type definitions
└── docs/                            # Production documentation & backend contracts
```

---

## 3. Layout & Navigation Hierarchy

The application shell adapts gracefully across mobile, tablet, desktop, and ultra-wide viewports:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ AppShell                                                               │
│ ┌───────────────┬────────────────────────────────────────────────────┐ │
│ │ Sidebar       │ Header (Logo, SearchBar, Unread Badges, Auth CTA)  │ │
│ │ (Desktop:     ├───────────────────────────────────┬────────────────┤ │
│ │  Home,        │ Main Viewport                     │ Suggested      │ │
│ │  Explore,     │ - Dynamic children                │ Creators       │ │
│ │  Create,      │ - Masonry columns:                │ (2XL+ screens: │ │
│ │  Library,     │   1 (mobile)                      │  Home &        │ │
│ │  Messages,    │   2 (min 360px)                   │  Explore only) │ │
│ │  Notifs,      │   3 (lg: 1024px)                  │                │ │
│ │  Profile,     │   4 (xl: 1280px)                  │                │ │
│ │  Settings)    │   5 (min 1900px)                  │                │ │
│ │               ├───────────────────────────────────┴────────────────┤ │
│ │               │ BottomNav (Mobile only: Home, Explore, Create, Lib)│ │
│ └───────────────┴────────────────────────────────────────────────────┘ │
│ Global Portals: Modals (Login, Edit, AddTo, Coll, Confirm) & Sheets    │
└────────────────────────────────────────────────────────────────────────┘
```

### Breakpoint Matrix
- Mobile Phone (`< 768px`): Sidebar hidden. Header shows compact brand + search. Bottom navigation bar active. Feed renders in 1 to 2 CSS columns.
- Tablet / Small Laptop (`768px - 1023px`): Sidebar active. Bottom bar hidden. Feed renders in 2 CSS columns.
- Desktop (`1024px - 1535px`): Sidebar active. Hover actions on pin cards active. Feed renders in 3 to 4 CSS columns.
- Ultra-wide Screens (`>= 1536px`): Right-hand sidebar activates on feed routes rendering "Creators to follow". Feed scales up to 5 CSS columns.

---

## 4. Design & Styling System

The application strictly implements an editorial brutalist design language:
- **Colors**:
  - `bg` (`#FAFAF8` light / `#121212` dark): Canvas background
  - `fg` (`#0A0A0A` light / `#EDEDED` dark): Primary typography and contrast borders
  - `sub` (`#F3F2EE` light / `#1A1A1A` dark): Card containers and input backgrounds
  - `line` (`#E5E4DE` light / `#2A2A2A` dark): 1px structural dividing lines
  - `mut` (`#6B6960` light / `#8C8A82` dark): Muted secondary metadata
  - `coral` (`#E54D2E`): Unread indicators, badges, and destructive warnings
  - `navy` (`#1D2A44`): Active tab indicators and focus rings
- **Typography**:
  - Headings & Titles: `Space Grotesk`, bold, letter-spacing `-0.02em`
  - Body & UI Text: `Space Grotesk`, regular (`400`) and medium (`500`)
  - Metadata, Chips & Badges: `IBM Plex Mono` (`.lbl`), uppercase, letter-spacing `0.05em`, `text-xs`
- **Zero-Pill Discipline**: Buttons, badges, and modals feature sharp, crisp rectangular edges (`rounded-none` or subtle 2px radius for avatar badges).

---

## 5. UI Component Primitives

All user-interface components in `components/ui/` adhere to standard accessibility guidelines:
- **`Dialog`**: Accessible modal overlay utilizing native dialog semantics, escape key trapping, backdrop blur, and body scroll lock.
- **`Field`**: Standardized form input wrapper supporting label, helper hints, error messaging, and password visibility toggling.
- **`Switch`**: Accessible toggle switch implementing `role="switch"` and `aria-checked`.
- **`Menu`**: Contextual actions dropdown supporting keyboard navigation, escape close, and outside-click detection.
- **`Tabs`**: ARIA-compliant tab list managing tab selection and panel switching.
- **`ImageUploader`**: Drag-and-drop file ingestion supporting JPG, PNG, and WebP up to 5MB with simulated progress bar.
- **`Toaster`**: Global transient notification queue rendering success, warning, and info notifications for 3 seconds.
- **`ProfileAvatar`**: Initials-based deterministic color block or image avatar with fallback.
