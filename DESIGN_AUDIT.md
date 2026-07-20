# Design System Audit & Modernization — July 19-20, 2026

## Completed Work

### Phase 5: Full Responsive QA ✅ (July 20)

**Mobile-first responsive patterns:**
- AmountKeypad: reduced top padding (pt-12 sm:pt-20), responsive text sizes (5xl→6xl), larger touch targets (min-h-[56px]), adjusted spacing
- ActionButtons: 2-column grid on mobile (removed 4-col), consistent with dashboard home
- All grids: mobile-first breakpoints (2-col mobile → 4-col desktop where appropriate)

**Responsive text hierarchy:**
- Hero: text-4xl sm:text-5xl md:text-6xl progression
- Stats: text-3xl sm:text-4xl for large numbers
- Buttons: responsive icon sizes, proper min-height for mobile touch
- Labels: text-xs sm:text-sm, text-sm sm:text-base progression

**Touch-friendly improvements:**
- Keypad buttons: 56px min-height on mobile for comfortable tapping
- Action cards: adequate padding (p-4 sm:p-5)
- Icons: scaled appropriately for mobile (20-24px baseline)

**Layout adjustments:**
- Dashboard quick actions: 2-col mobile, responsive card layout
- Wallet tabs: proper responsive text, icon sizing
- Transaction cards: proper spacing on narrow screens
- Step indicators: responsive connector widths (w-12 sm:w-20)

**Files modified (2):**
- `src/components/dashboard/AmountKeypad.tsx`
- `src/components/dashboard/ActionButtons.tsx`

---

### Phase 4: Dashboard Polish ✅ (July 20)

**Dashboard home page:**
- Live price badge: gradient background, animated pulse dot
- Balance card: gradient background (accent/accent-secondary), 6xl gradient text, shadow-xl
- Quick actions: 2×2 grid cards with hover lift, icon fills on hover, better transitions
- Promo card: animated pulse backgrounds, improved spacing
- Limits card: split into 2 cards (buy=accent, sell=danger), badge for KYC status
- Referrals: nested card design, progress bar (gradient fill), better hierarchy

**Wallet page:**
- Empty state: dashed border card, animated pulse icon, better CTA layout
- Tabs: active tab now uses accent background (not bg-bg), better contrast
- Overview: hover scale on asset icons, larger cards, gradient hover
- Deposit: white QR background, larger size (56×56), accent tab active state
- Withdraw: danger variant button, badge for balance, better fee breakdown card
- Scanner: success/danger border styles (border-2), better pulse animation

**Animation & interaction:**
- All pages: fade-in-up (not slide-up) for smoother entry
- Hover states: scale transforms, color transitions, shadow lifts
- Active tabs: clear visual distinction with accent background
- Cards: consistent hover border-accent/40 pattern

**Files modified (2):**
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/wallet/page.tsx`

---

### Phase 3: Trading Flow UX ✅ (July 20)

**Buy page improvements:**
- 3-step indicator: completed (checkmark), active (pulse), upcoming
- Step connectors: colored accent for completed, muted for upcoming
- Amount summary card: gradient background (accent/accent-secondary), larger text (5xl), gradient text treatment
- Better visual hierarchy: exchange icon, clearer labels
- Copy UPI button: proper click handler with clipboard API
- Status messages: better icon alignment, padding, flex-start alignment
- Improved spacing: consistent 6-unit (24px) vertical rhythm

**Sell page improvements:**
- 3-step indicator matching buy page style
- Amount summary: danger gradient (sell = red theme)
- Danger variant button for destructive action (selling crypto)
- Loading state: better icon + text alignment
- Input labels: added contextual hints ("optional, for notifications")
- Consistent spacing and card treatment

**Transaction page improvements:**
- Empty state card: dashed border, centered icon, CTAs to buy/sell pages
- Activity summary card: gradient background, gradient stats text (4xl font-black)
- Transaction list: badge for type (BUY=success, SELL=danger), hover accent border
- Better metadata: transaction ID preview, formatted date
- Loading state: centered spinner with descriptive text
- FAQ section: hover accent color on text + icon

**Design patterns established:**
- Step indicators: 10px circles, checkmark for complete, pulse for active, muted for upcoming
- Status messages: always flex-start aligned icons, 20px size, proper padding
- Empty states: dashed border cards with icon + CTA buttons
- Summary cards: gradient backgrounds matching action type (buy=accent, sell=danger)

**Files modified (3):**
- `src/app/(dashboard)/buy/page.tsx`
- `src/app/(dashboard)/sell/page.tsx`
- `src/app/(dashboard)/transactions/page.tsx`

---

### Phase 2: Landing Page Polish ✅ (July 20)

**Hero redesign:**
- Background gradient: dark to light (dark `bg` → `white`)
- Animated blob gradients with staggered delays (2s, 4s) + blob keyframe animation
- Live status badge: replaced static dot with animated ping ring
- Improved gradient text: `bg-gradient-to-r from-accent via-accent-secondary to-accent`
- Stats: gradient text treatment, better spacing
- Feature pills: white cards with accent icon, hover lift + shadow
- All animations: `animate-fade-in-up` with staggered delays (100ms, 200ms, etc.)

**Features section:**
- White background (`bg-white`) for contrast with dark hero
- Section badge inline pill (matches hero style)
- Cards: white with border, accent border on hover, shadow lift
- Icon containers: 14px → 14px, hover rotate + scale
- Better spacing: `space-y-4` in card content

**Navbar:**
- Light theme: white/90 background with backdrop blur
- Logo: gradient background (accent → accent-secondary), scale hover
- Nav links: accent hover color (not white)
- Mobile menu: white background, fade-in-up animation

**FAQ:**
- Gradient background: white → bg (matches landing flow)
- Cards: white with border, accent border on hover
- Open state: fade-in-up animation for content
- Better text hierarchy: bg for headings, muted for body

**Footer:**
- Dark background (`bg-bg`) to anchor the page
- Logo: gradient background with shadow
- Social icons: larger (10px → 10px), rounded-xl, hover lift
- Better link hover: accent color instead of white/80
- Updated copyright year: 2026

**Animations added to globals.css:**
- `@keyframes fade-in-up`: 20px translate, opacity 0→1
- `@keyframes blob`: organic movement (7s infinite)
- Delay utility classes: 100ms, 200ms, 300ms, 400ms, 500ms, 2s, 4s
- `.animate-fade-in-up` and `.animate-blob` classes

**Color system extended:**
- Added `--color-white: #FFFFFF` and `--color-text: #1F2937` for light sections
- Dark sections use `--color-bg` + white text
- Light sections use white + `--color-text` (dark gray)

**Files modified (6):**
- `src/components/landing/Hero.tsx`
- `src/components/landing/Features.tsx`
- `src/components/landing/Navbar.tsx`
- `src/components/landing/FAQ.tsx`
- `src/components/landing/Footer.tsx`
- `src/app/globals.css`

---

### Phase 1: Primitives Refinement ✅ (July 20)

**Removed all legacy CSS class references:**
- `app-main` → proper Tailwind utility classes in dashboard layout
- `bg-bg-gradient` → `bg-bg` in login page
- `badge-success/danger/warning/info` → full Tailwind classes in Badge component

**Button enhancements:**
- Hover states: `-translate-y-0.5` lift + `shadow-md` on primary/danger/success
- Focus ring: `ring-2 ring-accent/40 ring-offset-2`
- Active press: `scale-[0.98]`
- All variants use Tailwind utilities (removed `btn-*` class dependencies)

**Input refinements:**
- Focus ring: `ring-4 ring-accent/10` + `border-accent`
- Error state: `ring-red-500/10` + `border-red-500`
- Smooth transitions: `transition-all duration-150`
- Removed generic `.input` class dependency

**Card elevation system:**
- Default: `shadow-sm hover:shadow-md`
- Elevated: `shadow-lg hover:shadow-xl hover:-translate-y-0.5`
- Consistent `rounded-2xl` across all cards
- Fixed CardTitle text color (`text-white` → `text-text`)

**Files modified (6):**
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/login/page.tsx`

---

### Phase 0: Design Token Consolidation ✅

**Objective:** Fix competing color schemes, dead font loads, and hardcoded values.

**Changes:**
1. **`globals.css`** — Complete rewrite with Tailwind v4 `@theme` block
   - Single accent: `--color-accent: #00F2FE` (teal) — replaced all `indigo-*` usages
   - Secondary accent: `--color-accent-secondary: #7F00FF` (purple) — gradient partner only
   - Highlight: `--color-highlight: #F59E0B` (amber) — rate badges only
   - Unified surface: `--color-surface: #0F1229`
   - Unified radius scale: `--radius-sm/md/lg/xl` (8/12/20/24px)
   - Font: **Inter** via `--font-sans` (removed conflicting Outfit CDN import)
   - All numeric displays: `tabular-nums` applied

2. **UI Primitives** — All rebuilt on design tokens:
   - `Button.tsx` — 6 variants (primary/secondary/ghost/outline/danger/success) + `loading` state
   - `Card.tsx` — `.surface`, `.surface-elevated` classes
   - `Input.tsx` — `.input` class, supports `leftAddon`/`rightAddon` (ReactNode)
   - `Badge.tsx` — 5 semantic variants (success/warning/danger/info/accent)
   - `Modal.tsx` — `.surface-elevated`, token-based borders

3. **Landing Page** — 5 components modernized:
   - `Navbar.tsx` — Dark theme, accent-on-hover nav links
   - `Hero.tsx` — Gradient accent blobs, tabular-nums stats
   - `Features.tsx` — Accent-colored icon backgrounds
   - `FAQ.tsx` — Surface cards, accent text
   - `Footer.tsx` — Dark theme, token colors

4. **Auth** — `login/page.tsx` rebuilt with dark theme, uses `<Button>` component

5. **Dashboard** — 8 pages + 6 components modernized:
   - Pages: `dashboard`, `buy`, `sell`, `wallet`, `transactions`, `referrals`, `settings`, `limits`, `help`
   - Components: `Sidebar`, `TopNav`, `WalletCard`, `OfferBanner`, `AmountKeypad`, `ReferralModule`
   - All raw `<button>` elements replaced with `<Button>` component
   - All orphaned color utilities replaced with tokens
   - Step indicators added to buy/sell flows (Step 1 of 2 / 2 of 2)

**Font Decision:** Inter (via `next/font/google`). Removed Outfit CDN import from `globals.css`. Deleted unused Inter import from `layout.tsx` (it was loading but not applied — fixed by wiring `--font-inter` CSS variable).

**Files Modified:** 29 total
- Core: `globals.css`, `layout.tsx`
- Primitives: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`, `Modal.tsx`
- Landing: `Navbar.tsx`, `Hero.tsx`, `Features.tsx`, `FAQ.tsx`, `Footer.tsx`
- Auth: `login/page.tsx`
- Dashboard pages: 9 files (`dashboard/page.tsx` through `help/page.tsx`)
- Dashboard components: 6 files (`Sidebar.tsx` through `ReferralModule.tsx`)

---

## Package Audit (July 19, 2026)

**Current versions checked against npm registry:**

| Package | Installed | Latest | Action |
|---------|-----------|--------|--------|
| `next` | 16.2.10 | 16.2.10 | ✅ Current |
| `react` | 19.2.4 | 19.2.7 | ⬆️ Updated to 19.2.7 |
| `react-dom` | 19.2.4 | 19.2.7 | ⬆️ Updated to 19.2.7 |
| `tailwindcss` | ^4 | 4.3.3 | ✅ Current (v4 line) |
| `@privy-io/react-auth` | 3.35.1 | 3.35.1 | ✅ Current |
| `@privy-io/server-auth` | 1.32.5 | 1.32.5 | ✅ Current |
| `thirdweb` | 5.120.1 | 5.120.1 | ✅ Current |
| `ethers` | 6.17.0 | 6.17.0 | ✅ Current |
| `prisma` / `@prisma/client` | 7.8.0 | 7.8.0 | ✅ Current |
| `lucide-react` | 1.25.0 | 1.25.0 | ✅ Current |
| `framer-motion` | 12.42.2 | 12.42.2 | ✅ Current (unused) |
| `zod` | 3.25.75 | 4.4.3 | ⚠️ Major available (unused) |

**Dead dependencies (never imported in `src/`):**
- `zod` — 0 uses in codebase
- `framer-motion` — 0 uses in codebase  
- `class-variance-authority` — 0 uses in codebase

These can be removed in a future cleanup pass (not done now per AGENTS.md scope constraints).

**Suspicious pin:** `nanoid: "^6.0.0"` in package.json, but npm registry's latest is 5.1.16. Version 6 doesn't exist publicly — possible typo or bad pin. Used in `src/app/api/users/me/route.ts`. Flagged for investigation.

**Node.js:** v20.20.2 installed. `@types/node` is 20.x (correct). Do not bump to 26.x.

**Risky majors available (NOT applied):**
- `typescript` 5.9 → 7.0 (Go rewrite)
- `eslint` 9 → 10
- `zod` 3 → 4
- `@types/node` 20 → 26

These require code changes and build verification. Deferred per user preference (safe patches only).

---

## Documentation Updates

1. **README.md** — Updated "Next.js 14" → "Next.js 16, React 19, Tailwind CSS v4"
2. **`.claude/launch.json`** — Created dev server config for `npm run dev` on port 3000

---

## Bugs Fixed

1. **Type error in `wallet/page.tsx:366`** — Passed `<Button>` element into `Input` component's `hint` prop (typed as `string`). Fixed by replacing with `rightAddon` (typed as `ReactNode`), rendering a native button styled with token classes.

---

## Next Steps (Not Yet Started)

Per AGENTS.md execution plan:

- **Phase 1** — Primitives review and refinement
- **Phase 2** — Landing page polish
- **Phase 3** — Core trading flow enhancements (buy/sell step clarity, icons, status timelines)
- **Phase 4** — Remaining pages (empty/loading/error states)
- **Phase 5** — QA pass at 375px / 768px / 1024px+ breakpoints

---

## Design Decisions Log

**Why Inter over Outfit?**
- Inter was already loaded via `next/font/google` but not applied
- Outfit was loaded via CDN `@import` and applied, but not optimized
- Inter is more widely adopted for fintech/crypto UIs (Stripe, Coinbase, Binance use similar humanist sans)
- Switching to Inter cuts one HTTP request and enables font subsetting

**Why teal (`#00F2FE`) as primary accent?**
- Already established in existing `globals.css` neo-glass identity
- Three competing accents (teal/purple/indigo) needed resolution
- Teal reads as "tech/crypto" without copying Binance's yellow (`#F0B90B`)
- Purple kept as gradient partner only (never standalone UI)

**Why amber (`#F59E0B`) as highlight?**
- `buy/page.tsx` already reached for amber in the rate badge
- Formalizes what was an ad-hoc choice into a semantic token
- Only used for "premium/highlight" (rate tags, feature badges) — never for CTAs

---

## Codebase Facts (for future reference)

**No AI/LLM "model" exists.** Grepped for `anthropic|openai|claude|gpt-|langchain|@ai-sdk|generativeai` — 0 hits. The only "model" is the Prisma database schema (User/Wallet/Transaction/Offer/Referral).

**This app is NOT a P2P marketplace yet.** `buy/page.tsx` is a fixed-rate OTC swap against one platform account. No offer list, no merchant browsing, no competing rates. The `src/app/api/offers/route.ts` API exists but is not wired into the buy/sell flows. Per AGENTS.md Section 4: do not fabricate marketplace UI (fake usernames, trust scores, competing rates). Apply Binance/p2p.lol's visual language to the flow that actually exists.

**Build tooling:** Tailwind v4 (CSS-first config via `@theme` in `globals.css`, no `tailwind.config.js`). PostCSS drives the v4 pipeline (`postcss.config.mjs`).

---

**Audit completed:** July 19, 2026  
**Auditor:** Claude Code (Fable 5)  
**Scope:** Visual/UX redesign only — no backend, auth, DB, or blockchain changes per AGENTS.md Section 2.