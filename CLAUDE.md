# CLAUDE.md — QA Playground

> Machine-readable project context for Claude Code. Keep this up-to-date as the project evolves.

---

## Project Overview

**QA Playground** (`qatesting`) is an educational web platform for QA automation engineers to practice browser automation testing. It provides:

- 22 interactive UI elements (inputs, buttons, tables, calendars, drag-drop, alerts, etc.) for Selenium/Playwright/Cypress practice
- A simulated Bank Demo App (login, accounts, dashboard, transactions) for end-to-end automation scenarios
- A Study Tracker for tracking QA learning progress across syllabi, daily logs, and saved resources
- Free QA Tools (JSON to file converter, more coming soon)
- Markdown-based blog and tutorials focused on QA automation
- JavaScript learning content
- Admin dashboard with role-based access control

**Problem it solves:** QA engineers lack realistic, purpose-built playgrounds to practice automation. Most real apps aren't designed with testability in mind. This one is.

**Target audience:** QA automation engineers learning or practicing Selenium/Playwright/Cypress automation.

**Live URL:** https://www.qaplayground.com
**GitHub:** https://github.com/kundalik5545/qatesting
**Deployment:** Vercel

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^16.1.7 |
| Runtime | React | ^19.2.4 |
| Language | JavaScript/JSX | (no TypeScript) |
| Styling | Tailwind CSS | ^3.4.19 |
| UI Components | shadcn/ui (new-york style) | — |
| UI Primitives | Radix UI | various |
| Icons | lucide-react, react-icons | ^0.577.0, ^5.6.0 |
| Themes | next-themes | ^0.4.6 |
| Toast | sonner | ^2.0.7 |
| Date picker | react-day-picker | ^9.14.0 |
| Drawer | vaul | ^1.1.2 |
| Markdown parsing | unified, remark, rehype pipeline | various |
| Syntax highlighting | shiki, rehype-pretty-code | ^4.0.2, ^0.14.3 |
| SEO | next-sitemap | ^4.2.3 |
| Analytics | @vercel/analytics | ^2.0.1 |
| Authentication | better-auth | ^1.5.6 |
| ORM | Prisma (prisma-client-js) | ^7.5.0 |
| DB Driver | pg (PostgreSQL) | ^8.20.0 |
| Bundler | Turbopack (dev) | built-in Next.js |
| Package manager | npm | — |
| Class merging | clsx + tailwind-merge (via `cn()`) | — |

**External Services:**
- Google Analytics: `G-Z4H9RTYGS4`
- Buy Me Coffee widget (in root layout)
- Usercentrics consent management (in root layout)
- ImageKit CDN (`ik.imagekit.io`) for images
- randomuser.me for avatar images

**Path alias:** `@/*` maps to the project root.

---

## File Structure

### Root Level

```
/
├── app/                          Next.js App Router — all pages & layouts
├── components/                   React components (custom + shadcn/ui)
├── data/                         Static config and data arrays
├── lib/                          Utility functions and helpers
├── Blog/                         Markdown content files (blog + element docs)
├── prisma/                       Prisma schema
│   └── schema.prisma             PostgreSQL schema (User, Session, Account, Resource, ApiKey, Verification)
├── public/                       Static assets (SVGs, images, docs)
├── CLAUDE.md                     This file
├── middleware.js                 Next.js middleware — protects /admin routes (role check via Better-Auth)
├── prisma.config.ts              Prisma configuration (required by Prisma tooling — do not convert)
├── package.json                  Dependencies and scripts
├── jsconfig.json                 Path alias config (@/*)
├── components.json               shadcn/ui config (new-york, slate base)
├── next.config.mjs               Image domains, server action size limit
├── vercel.json                   Vercel deployment config
├── next-sitemap.config.js        Sitemap generation (qaplayground.com)
├── .ai-project-config.json       Machine-readable project metadata (do not delete)
└── docs/                         Project documentation
    ├── AI_CODING_GUIDELINES.md   Rules and guidelines for AI agents
    ├── BANK_MIGRATION_NOTES.md   Bank feature migration notes
    ├── DEV_QUICK_REFERENCE.md    Quick dev reference
    ├── STUDY_TRACKER_DB_MIGRATION_ANALYSIS.md  Full analysis: localStorage → DB migration
    └── tasks/                    Active task tracking files
        └── STUDY_TRACKER_DB_MIGRATION_TASKS.md  Phase-by-phase tasks for DB migration
```

### app/ — Routes & Layouts

```
app/
├── layout.js                     ROOT LAYOUT — providers, fonts, analytics, header/footer
├── page.js                       Landing page (/)
├── not-found.jsx                 404 page
├── globals.css                   Global Tailwind + CSS vars + custom utilities
├── robots.js                     SEO: robots.txt generator
├── sitemap.js                    SEO: sitemap.xml generator
├── favicon.ico

├── (bank)/                       Route group: Bank Demo App
│   ├── layout.js                 Hides global header/footer on bank pages (client component)
│   └── bank/
│       ├── page.jsx              Login page (/bank) — creds: admin / admin123
│       ├── dashboard/page.jsx    Dashboard (/bank/dashboard)
│       ├── accounts/page.jsx     Accounts CRUD (/bank/accounts)
│       └── transactions/page.jsx Transaction management (/bank/transactions)

├── (contact)/                    Route group: Static/contact pages
│   ├── layout.js
│   ├── about-me/page.jsx         /about-me
│   ├── about-us/page.jsx         /about-us
│   ├── contact-us/page.jsx       /contact-us
│   ├── privacy-policy/page.jsx   /privacy-policy
│   └── site-alerts/page.jsx      /site-alerts — admin-managed site-wide alerts

├── (admin)/                      Route group: Authentication & Admin dashboard
│   ├── login/page.jsx            /login — Better-Auth email/password login
│   ├── signup/page.jsx           /signup — Better-Auth user registration
│   └── admin/
│       └── dashboard/page.jsx    /admin/dashboard — role-gated admin panel (ADMIN only)

├── (Practice)/                   Route group: Practice + Learn content
│   ├── layout.js
│   ├── practice/
│   │   ├── page.jsx              Practice hub (/practice) — grid of 22 elements
│   │   ├── layout.js
│   │   ├── [slug]/               Dynamic practice pages (/practice/[slug])
│   │   │   ├── page.jsx          Reads markdown + renders component
│   │   │   └── layout.js
│   │   └── _components/          One component per practice element
│   │       ├── InputPage.jsx
│   │       ├── ButtonPage.jsx
│   │       ├── SelectPage.jsx
│   │       ├── LinkPage.jsx
│   │       ├── AlertPage.jsx
│   │       ├── RadioButton.jsx
│   │       ├── WindowsPage.jsx
│   │       ├── WaitPage.jsx
│   │       ├── FileUploadDownloadPage.jsx
│   │       ├── CalendarPage.jsx
│   │       ├── TablePage.jsx
│   │       ├── AdvanceTablePage.jsx
│   │       ├── ElementsPage.jsx
│   │       ├── FormsPage.jsx
│   │       ├── MultiSelectPage.jsx
│   │       └── TextsBoxPage.jsx
│   ├── learn/
│   │   ├── [slug]/page.jsx       Learning content pages (/learn/[slug])
│   │   └── _components/
│   │       ├── CoursesPage.jsx
│   │       └── LogicalPrograms.jsx
│   └── javascript/
│       └── [slug]/page.jsx       JS course pages (/javascript/[slug])

├── (study)/                      Route group: Study Tracker
│   ├── layout.js
│   └── study-tracker/
│       ├── page.jsx              Study Tracker app (/study-tracker)
│       ├── layout.js
│       ├── study-tracker.css     Study Tracker custom styles
│       ├── dashboard/page.jsx    Study Tracker dashboard sub-page
│       ├── ai-syllabus-prompt/
│       │   ├── page.jsx          AI syllabus prompt helper (/study-tracker/ai-syllabus-prompt)
│       │   └── PromptPageContent.jsx
│       └── _components/
│           ├── StudyTrackerApp.jsx   Root shell (tabs, auth session, nav)
│           ├── DashboardView.jsx     Stats + progress summary
│           ├── DailyTrackerView.jsx  Log daily study sessions
│           ├── SyllabusView.jsx      View/browse syllabus topics
│           ├── SyllabusManagerView.jsx  Import/export/manage syllabi
│           └── ResourcesView.jsx     Save and manage learning resources

├── (tools)/                      Route group: QA Tools
│   ├── layout.js
│   └── qa-tools/
│       ├── page.jsx              QA Tools hub (/qa-tools) — tool cards grid
│       ├── ToolCard.jsx          Tool card component
│       └── json-to-file/         JSON → Downloadable File tool (/qa-tools/json-to-file)
│           ├── page.jsx
│           ├── JsonToFileContent.jsx
│           └── _components/
│               ├── FilenameDownload.jsx
│               ├── HowItWorksSection.jsx
│               ├── JsonStatusBar.jsx
│               ├── PageBreadcrumb.jsx
│               ├── PasteEditor.jsx
│               ├── RelatedToolsBar.jsx
│               └── SuccessBanner.jsx

├── api/
│   ├── auth/[...all]/route.js    Better-Auth catch-all handler (login, signup, session, etc.)
│   ├── admin/verify/route.js     Admin role verification endpoint
│   ├── resources/
│   │   ├── route.js              GET all resources, POST new resource (authenticated)
│   │   └── [id]/route.js         GET, PUT, DELETE single resource by ID
│   └── api-keys/route.js         API key management (create, list)

└── (blog)/
    └── blog/page.jsx             Blog index (/blog)
```

### components/

```
components/
├── Header.jsx                    Main site nav with dark mode toggle
├── NavbarSheet.jsx               Mobile slide-out nav (Sheet component)
├── SiteAlertPopup.jsx            Site-wide alert popup (driven by alertStorage)
├── hero.jsx                      Hero section on landing page
├── bank/
│   └── BankNavbar.jsx            Bank app nav — logout clears sessionStorage
├── lib/
│   ├── Footer.jsx                Site footer
│   ├── FooterLinks.jsx           Footer navigation links
│   ├── Mode-toggle.jsx           Dark/light toggle button (DropdownMenu)
│   ├── SocialShare.jsx           Social share utilities
│   └── theme-provider.jsx        next-themes ThemeProvider wrapper
└── ui/                           shadcn/ui base components — DO NOT HAND-EDIT
    ├── accordion.jsx, alert.jsx, alert-dialog.jsx, avatar.jsx
    ├── badge.jsx, button.jsx, calendar.jsx, card.jsx, checkbox.jsx
    ├── dialog.jsx, drawer.jsx, dropdown-menu.jsx, input.jsx, label.jsx
    ├── popover.jsx, progress.jsx, radio-group.jsx, select.jsx, sheet.jsx
    ├── sonner.jsx, switch.jsx, table.jsx, textarea.jsx, tooltip.jsx
```

### data/

```
data/
├── BasicSetting.js               basicDetails, allUrls, socialHandles
├── blogs.js                      Array of blog metadata objects
├── elementsTestCases.js          Test case arrays for each UI element
├── formsTestCases.js             Test case arrays for form elements
├── landingPage.js                statsData, featuresData, howItWorksData, testimonialsData
├── sitemap-links.js              siteMapUrls array for sitemap generation
└── studyTrackerSyllabi.js        Default syllabus data for the Study Tracker
```

### lib/

```
lib/
├── utils.js                      cn() — clsx + tailwind-merge helper
├── bankStorage.js                localStorage abstraction for Bank Demo
├── studyTrackerStorage.js        localStorage abstraction for Study Tracker (syllabus, daily logs, stats)
├── alertStorage.js               localStorage abstraction for site-wide alerts
├── auth.js                       Better-Auth server config (Prisma adapter, email/password, roles, session)
├── auth-client.js                Better-Auth client (useSession hook, signIn, signOut)
└── prisma.js                     Prisma client singleton
```

### Blog/

```
Blog/
├── elements/                     Element docs markdown (one per practice element — slug = filename)
├── posts/                        Blog post markdown files
├── learn/                        Learn content markdown
└── JavascriptBlog/               JS syllabus content
```

---

## Architecture & Data Flow

### App Router Structure

Next.js App Router with route groups — `(bank)`, `(contact)`, `(admin)`, `(Practice)`, `(blog)`, `(study)`, `(tools)` — used purely for layout isolation. Route groups don't affect URL structure.

### Data Flow

```
User → Page Component
  → data/*.js files (static arrays)           — landing page content, blog metadata, syllabi
  → Blog/*.md files (markdown)                — dynamic page content via unified pipeline
  → lib/bankStorage.js (localStorage)         — bank app state persistence
  → lib/studyTrackerStorage.js (localStorage) — study tracker state (syllabus, logs)
  → lib/alertStorage.js (localStorage)        — site-wide alerts
  → sessionStorage                            — bank login session auth
  → PostgreSQL (via Prisma + Better-Auth)     — user accounts, sessions, resources, API keys
```

### Authentication & Authorization

| Layer | What it does |
|---|---|
| `lib/auth.js` | Better-Auth server config — email/password, Prisma adapter, role field, 7-day sessions |
| `lib/auth-client.js` | Better-Auth client — `useSession()`, `signIn.email()`, `signOut()` |
| `app/api/auth/[...all]/route.js` | Better-Auth catch-all API handler |
| `middleware.js` | Protects `/admin/*` — checks session via `/api/auth/get-session`, redirects non-ADMINs |
| Prisma `Role` enum | `USER` (default) or `ADMIN` — stored in `User` model |

### State Management

| What | Where |
|---|---|
| Auth session (site-wide) | Better-Auth — server sessions in PostgreSQL, client cookie |
| Bank login session | `sessionStorage` — key: `bankUser` |
| Bank accounts + transactions | `localStorage` — managed via `lib/bankStorage.js` |
| Study Tracker state | `localStorage` via `lib/studyTrackerStorage.js` (anonymous users); **PostgreSQL via Prisma for logged-in users** (migration in progress — see `docs/tasks/STUDY_TRACKER_DB_MIGRATION_TASKS.md`) |
| Site alerts | `localStorage` — managed via `lib/alertStorage.js` |
| Theme (dark/light) | `next-themes` — class-based on `<html>` |
| Toast notifications | `sonner` via `<Toaster>` in root layout |
| All other state | Local `useState` in components — no global store |

### Prisma Schema (PostgreSQL)

```
User          — id, name, email, emailVerified, image, role (USER|ADMIN), createdAt, updatedAt
Session       — id, token, expiresAt, userId (FK), ipAddress, userAgent
Account       — id, accountId, providerId, userId (FK), accessToken, refreshToken, password, ...
Verification  — id, identifier, value, expiresAt
Resource      — id, userId (FK), resourceType (ARTICLE|VIDEO|COURSE|BOOK|TOOL|DOCUMENTATION|OTHER),
                title, url, description, tags[], image, createdAt, updatedAt
ApiKey        — id, userId (FK), name, key (unique), createdAt
```

**Planned models (Study Tracker DB migration — not yet in schema):**
```
UserSyllabus     — id, userId (FK), syllabusId, data (Json), updatedAt
TopicProgress    — id, userId (FK), topicId, done, notes?, doneAt?, updatedAt
SubtopicProgress — id, userId (FK), topicId, subtopicTitle, checked, updatedAt
DailyTask        — id, userId (FK), date, taskId, title, done, timeMin, createdAt, updatedAt
Habit            — id, userId (FK), habitId, title, timeMin, recurrence, customDays[], startDate, endDate?, active, createdAt, updatedAt
HabitLog         — id, userId (FK), habitId (FK → Habit), date, done, updatedAt
ActivityLog      — id, userId (FK), date, topicId?, syllabusId?, action, createdAt
```
See `docs/STUDY_TRACKER_DB_MIGRATION_ANALYSIS.md` for full schema and migration rationale.

### Markdown Pipeline (for Blog + Practice pages)

```
.md file (Blog/) → gray-matter (frontmatter) → unified pipeline:
  remark-parse → remark-gfm → remark-rehype
  → rehype-slug → rehype-autolink-headings
  → rehype-pretty-code (shiki highlighting) → rehype-stringify
→ HTML string → dangerouslySetInnerHTML in page component
```

### Dynamic Practice Pages ([slug])

1. `generateStaticParams()` reads all `.md` files from `Blog/elements/`
2. Page reads the matching `.md` file, parses frontmatter + content
3. A `componentMap` object maps slug → React component (e.g. `"input-fields"` → `<InputPage />`)
4. Both the markdown content AND the interactive component render on the same page

### Bank App Data Flow

```
lib/bankStorage.js
├── initializeData()       → seeds localStorage with default admin account
├── getAccounts()          → reads from localStorage
├── saveAccount()          → writes to localStorage
├── getTransactions()      → reads from localStorage
├── saveTransaction()      → writes, also calls updateAccountBalance()
└── clearAllData()         → nukes all localStorage keys
```

Bank pages check `sessionStorage` for auth on every load and redirect to `/bank` (login) if not authenticated.

---

## Design System

### Project Design Style Guide
We maintain a repository of reusable design templates, UI patterns, and styling blocks in `project-design-style.md`. 
**For AI Assistants:** Reference `project-design-style.md` when asked to safely replicate a known card, banner, or styling format. Use the `Add new design template` skill when requested to document a new UI pattern in this guide.

### Colors & Theme

Uses **CSS variables** defined in `app/globals.css` for light + dark mode, following shadcn/ui's `new-york` style with **slate** as base color.

| Token | Usage |
|---|---|
| `--background` / `--foreground` | Page background and text |
| `--primary` | Primary action color (slate-based) |
| `--muted` | Muted text/backgrounds |
| `--card` | Card backgrounds |
| `--border` | Borders |
| `--ring` | Focus rings |
| `--radius` | 0.5rem default border radius |

### Custom Utilities (globals.css)

```css
.gradient          /* blue-to-purple gradient background */
.gradient-sub      /* red-to-purple gradient background */
.gradient-title    /* gradient text (blue-to-purple) for headings */
.gradient-subTitle /* gradient text (red-to-purple) */
```

### Typography

- **Font:** Inter (Google Fonts, loaded in root layout)
- **Prose:** `@tailwindcss/typography` plugin applied to markdown-rendered content
- **Dark mode:** Class-based (`class` strategy in next-themes)

### CSS Approach

- Tailwind CSS utility classes everywhere — no CSS Modules
- CSS variables for theming (not hardcoded colors)
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoint prefixes
- Custom bank-page hiding: `.bank-page header, .bank-page footer { display: none }` in globals.css
- Exception: `app/(study)/study-tracker/study-tracker.css` for Study Tracker-specific styles

---

## Key Features Already Built

### Authentication (`/login`, `/signup`)
- Email/password auth via Better-Auth
- Role-based: `USER` (default) and `ADMIN`
- Session lasts 7 days, cookie refreshes daily
- Admin routes protected by `middleware.js`

### Admin Dashboard (`/admin/dashboard`)
- Role-gated (ADMIN only) via Next.js middleware
- Non-admin users redirected to `/`
- Unauthenticated users redirected to `/login`

### Study Tracker (`/study-tracker`)
- Track QA learning progress across multiple syllabi (Manual Testing, Automation, API, Playwright, etc.)
- Views: Dashboard, Syllabus, Daily Tracker, Syllabus Manager, Resources
- Import/export syllabi as JSON (AI-generated format supported)
- AI Syllabus Prompt helper at `/study-tracker/ai-syllabus-prompt`
- Resources management — save articles, videos, courses, books, tools by type
- Resources backed by PostgreSQL (authenticated users) via `/api/resources`
- Non-auth state stored in `localStorage` via `lib/studyTrackerStorage.js`

### QA Tools (`/qa-tools`)
- Tool hub with card-based layout
- **JSON → Downloadable File** (live): paste AI-generated JSON with FILENAME prefix, download as `.json`
- Coming soon: JSON Formatter, Base64 Encoder/Decoder, JWT Token Decoder, Regex Tester

### Bank Demo Application (`/bank`)
- Login with hardcoded credentials (`admin` / `admin123`)
- "Remember me" via localStorage
- Dashboard: total balance card, accounts count, transactions count, recent transactions table
- Accounts page: list, create, edit, delete accounts
- Transactions page: create transactions (credit/debit), filter by account/type/date range
- Balance auto-updates when transactions are saved
- All localStorage — no backend, no API calls
- Automation-friendly: elements have `id`, `data-testid`, `data-action` attributes

### Practice Elements (`/practice`)

22 elements available:
1. POM (Page Object Model demonstration)
2. Input (text, password, email, number, textarea)
3. Button (click, double-click, right-click, disabled)
4. Select (single, multi-select dropdowns)
5. Links
6. Alert (alert, confirm, prompt dialogs)
7. Frame (iFrame handling)
8. Radio buttons & checkboxes
9. Window (new tab/window switching)
10. Elements (visibility, enabled state)
11. Drag & Drop
12. Drop Zone
13. Sort
14. Multi-Select
15. Slider
16. Waits (explicit/implicit wait scenarios)
17. Simple Table
18. Advanced Table
19. Calendar (date picker)
20. Forms
21. File Upload/Download
22. Shadow DOM

### Blog System (`/blog`, `/learn/[slug]`, `/javascript/[slug]`)
- Markdown-based content in `Blog/` directory
- Frontmatter metadata: title, description, date, author, image, tags, slug
- Syntax-highlighted code blocks (shiki)
- Prose-styled HTML output

### Site Alerts (`/site-alerts`)
- Admin-managed site-wide alerts displayed as popups
- Stored in localStorage via `lib/alertStorage.js`
- Rendered via `components/SiteAlertPopup.jsx`

### SEO
- `app/sitemap.js` — dynamic sitemap generation
- `app/robots.js` — robots.txt generation
- `next-sitemap` — post-build sitemap (configured for qaplayground.com)
- Per-page `generateMetadata()` for dynamic OG/Twitter tags
- Google Analytics (`G-Z4H9RTYGS4`)

---

## Conventions & Rules

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase + `.jsx` | `InputPage.jsx`, `BankNavbar.jsx` |
| Pages | lowercase `page.jsx` or `page.js` | `page.jsx` |
| Layouts | lowercase `layout.js` | `layout.js` |
| Data files | camelCase `.js` | `basicSetting.js`, `landingPage.js` |
| Utilities | camelCase `.js` | `bankStorage.js`, `utils.js` |
| Slugs | kebab-case | `file-upload`, `input-fields`, `alerts-dialogs` |

### Import Paths

Always use the `@/` alias — no relative paths:
```js
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { basicDetails } from "@/data/BasicSetting"
import { authClient } from "@/lib/auth-client"
import { prisma } from "@/lib/prisma"
```

### Styling Rules

- **Tailwind only** — no inline styles, no CSS Modules, no styled-components
- Use `cn()` from `@/lib/utils` for conditional classes
- Dark mode variants via `dark:` prefix — do not break dark mode on any component
- Responsive via `sm:`, `md:`, `lg:` — never hardcode widths
- Exception: Study Tracker uses `study-tracker.css` for scoped styles

### Practice Component Structure

Each practice component in `app/(Practice)/practice/_components/` follows this pattern:
1. `QAPlayGround` section — the interactive elements for automation testing
2. `LearningInsight` section — explanatory content for the learner

Both sections must be present in every practice component.

### Bank App Rules

- All bank data must go through `lib/bankStorage.js` — never read/write localStorage directly in components
- Auth check must happen at the top of every bank page (check `sessionStorage`, redirect if not found)
- Preserve all `id`, `data-testid`, and `data-action` attributes — these are the automation testing hooks

### Authentication Rules

- All auth operations use `lib/auth-client.js` on the client and `lib/auth.js` on the server
- Never read/write the `User`, `Session`, or `Account` tables directly — go through Better-Auth APIs
- Admin route protection is handled by `middleware.js` — do not replicate in page components
- The `role` field cannot be set by clients (enforced in `lib/auth.js` via `input: false`)

### API Routes Rules

- Resource CRUD lives in `app/api/resources/` — always verify the user session before mutating
- Use `lib/prisma.js` singleton for all database access — do not create new PrismaClient instances

### Do NOT Touch

- `components/ui/` — these are shadcn/ui generated files. Use the shadcn CLI to update them, not manual edits
- `public/mainicons/` — SVG icons referenced by name from data files
- `.ai-project-config.json` — machine-readable metadata, update only when project structure changes significantly
- Google Analytics ID `G-Z4H9RTYGS4` in `app/layout.js` — do not change
- `next-sitemap.config.js` site URL — must remain `https://www.qaplayground.com/`
- `prisma.config.ts` — required by Prisma tooling, do not convert to `.js`

### No TypeScript

This project uses plain JavaScript/JSX. Do not add `.ts` or `.tsx` files. Do not add type annotations.
Exception: `prisma.config.ts` is required by Prisma tooling — do not convert it.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `BETTER_AUTH_URL` | Base URL for Better-Auth (defaults to `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Secret key for Better-Auth session signing |

---

## Known Issues / TODOs

- Practice elements without a markdown file in `Blog/elements/` yet: Drag, Drop, Sort, Slider, Shadow DOM, Advance Table — these routes are not statically generated and should not be in `sitemap-links.js` until the `.md` files are added.
- **[IN PROGRESS]** Study Tracker full DB migration underway — moving all 8 localStorage keys (`qa_tracker_*`) to PostgreSQL per-user. Plan + tasks tracked in `docs/tasks/STUDY_TRACKER_DB_MIGRATION_TASKS.md`. Analysis in `docs/STUDY_TRACKER_DB_MIGRATION_ANALYSIS.md`. Anonymous users remain unaffected (localStorage-only). Phases 1–6 must ship before Phase 7 (localStorage removal).
- QA Tools beyond JSON-to-file (JSON Formatter, Base64, JWT Decoder, Regex Tester) are stubbed as "coming soon".

---

## My Preferences

- Be direct and blunt — no flattery
- Prefer targeted edits over full rewrites
- Always mention the file name before showing code
- Ask one clarifying question at a time, not five
- Flag bad approaches immediately before implementing
- No unnecessary dependencies — prefer native solutions

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **qa-playground** (1630 symbols, 3755 relationships, 114 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/qa-playground/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/qa-playground/context` | Codebase overview, check index freshness |
| `gitnexus://repo/qa-playground/clusters` | All functional areas |
| `gitnexus://repo/qa-playground/processes` | All execution flows |
| `gitnexus://repo/qa-playground/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
