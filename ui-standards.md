---
paths:
  - "src/**/*.tsx"
---

# UI Standards

## Core Principles
1. **UI only** — when making visual changes, zero changes to API calls, state logic, hooks, or data fetching
2. **Never delete functionality** — only change the visual wrapper, keep all existing features
3. **No new npm packages** without explicit user approval
4. **Reusable components** — extract shared patterns into `src/components/ui/`. Propose to user before creating a new one.
5. **Explain before coding** — give a technical breakdown of what files/lines will change. Wait for confirmation, then code.

---

## Dark Mode — Always Check Both Themes

**Never use hardcoded hex for backgrounds/inputs:**
- Panel backgrounds: `var(--bg-page)`
- Input / textarea / select: `var(--input-bg)`
- Modal / card backgrounds: `var(--card)`
- Status badge backgrounds: `rgba()` semi-transparent tints only

**Token quick reference:**
```
Panel bg:        var(--bg-page)      → #FAF9F7 light / #1C1C1A dark
Input bg:        var(--input-bg)     → #ffffff light / #2E2E2C dark
Table row bg:    var(--bg-surface)   → #F5F3F0 light / #242422 dark
Hover bg:        var(--bg-element)   → #EEECEA light / #2E2E2C dark
Border:          var(--border-def)   → #E5E3DF light / #383836 dark
Muted border:    var(--border-muted) → #EEECEA light / #2E2E2C dark
```

**Exception — the ONLY place "#ffffff" is acceptable:** `color: "#fff"` on filled accent/semantic buttons.

---

## Checklist — Run on Every Component Touch

### Button colors — use exactly these, nothing else:

| Type | Background | Color | Border | When to use |
|---|---|---|---|---|
| Primary / Save | `var(--accent)` | `#fff` | none | Forward/confirm action |
| Ghost / Cancel / Secondary | `var(--accent-sub)` | `var(--accent)` | `1px solid var(--accent-bdr)` | Cancel, back, secondary |
| Danger / Delete | `#dc2626` | `#fff` | none | Destructive confirms INSIDE ConfirmModal only |
| Semantic confirm (verify/approve) | `#16a34a` | `#fff` | none | "Mark as Verified", "Approve" |
| Success badge (read-only) | `rgba(22,163,74,0.10)` | `#16a34a` | none | Read-only state badges only — NOT clickable |

- Never hardcode `#4338ca`, `rgba(59,130,246,…)` — use `var(--accent)`, `var(--accent-sub)`, `var(--accent-bdr)`
- `#dc2626` = only permitted red (danger buttons + required-field asterisks)
- `#16a34a` = only permitted green (semantic verify/approve buttons)

### Icon colors:
- Never hardcode teal (#14b8a6), purple (#a78bfa), indigo (#4338ca) — use `var(--accent)` or `currentColor`
- Icon container backgrounds: `var(--accent-sub)` not `rgba(59,130,246,0.1)`

### Chips / tags:
- Active: `background: var(--accent)`, `color: '#fff'`, `border: 1px solid var(--accent)`
- Inactive: `background: var(--accent-sub)`, `color: var(--accent)`, `border: 1px solid var(--accent-bdr)`

### Border radius:
- Chips/tags: `borderRadius: 4` — never `borderRadius: 20` (pill)
- Cards: `borderRadius: 4` for table-adjacent content, `var(--r-md)` / `var(--r-lg)` only for true floating cards/modals
- Buttons: `borderRadius: 4`
- Inputs: `borderRadius: 4`

### CSS variable mapping — old → new (always use new column):
| Old (do NOT use) | New (correct) |
|---|---|
| `var(--surface)` | `var(--bg-surface)` |
| `var(--border)` | `var(--border-def)` |
| `var(--text)` | `var(--text-pri)` |
| `var(--muted)` | `var(--text-muted)` |
| `var(--text-2)` | `var(--text-sec)` |
| `var(--bg)` / `var(--fg)` | `var(--bg-page)` / `var(--text-pri)` |
| `fontWeight: 700` | `fontWeight: 600` (max allowed — no exceptions) |

### Status / verification labels (table cells, inline text):
- Plain colored text only — **no dot prefix, no background, no border, no pill shape**
- Pattern: `<span style={{ fontSize: 12, fontWeight: 500, color: cfg.color }}>{cfg.label}</span>`
- If you see a dot, background, padding, or borderRadius on a status label in a table cell — remove it.

### Delete / destructive actions:
- ALWAYS gate behind `<ConfirmModal>` — never fire instantly on click
- Import: `import ConfirmModal from '@/components/ConfirmModal'`
- Pattern: `onClick={() => setPendingDeleteId(item.id)}` → render ConfirmModal when `pendingDeleteId` is set

---

## Anti "Vibe-Coded" Design — Never Violate

**Never:**
- Wrap tables or list sections in a card with `border` + `borderRadius` — #1 vibe-coded smell
- Nest a card inside a card
- Add `boxShadow` to content rows, info strips, or form sections
- Give every section its own coloured background box

**Always:**
- Tables/lists sit flat on `var(--bg-page)`, rows separated by `border-bottom: 1px solid var(--border-def)` only
- Section headings render directly on page background — no wrapping card
- White space IS the divider between sections
- True cards: `background: var(--card)` + `border: 1px solid var(--border-def)` + `borderRadius` — sparingly

---

## Tech Constraints
- Font: **Inter** — `var(--font-inter)`. Do NOT add `fontFamily` strings other than `"inherit"` in components
- No `useEffect` with missing deps, no `any`, no `// @ts-ignore`

---

## Typography Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title | 20px | 600 | letterSpacing: -0.01em |
| Section heading | 14px | 600 | — |
| Card title | 16px | 500 | letterSpacing: -0.01em |
| Panel title | 13px | 600 | — |
| Panel subtitle | 11px | 500 | — |
| Form field label | 11px | 500 | uppercase, letterSpacing: 0.05em |
| Table column header | 10px | 500 | uppercase, letterSpacing: 0.06em |
| Table primary value | 13px | 500 | — |
| Table secondary / body | 13px | 400 | — |
| Input text | 12px | 400 | — |
| Chip / tag | 11px | 500 | letterSpacing: 0.01em |
| Tab label | 13px | 500 | — |
| Sidebar nav item | 13px | 400 (inactive) / 500 (active) | — |
| Meta field label | 10px | 500 | uppercase, letterSpacing: 0.06em |

---

## CSS Variables

```
--accent: #2563eb          (blue — primary buttons, links, active states)
--accent-sub: #EFF6FF      (light blue — chip/icon backgrounds)
--accent-bdr:              (border for accent-sub chips/buttons)
--bg-page: #FAF9F7         (warm page background — ALL pages)
--bg-surface: #F5F3F0      (table header rows)
--bg-element: #EEECEA      (hover backgrounds)
--card: #ffffff            (card backgrounds — stays pure white)
--input-bg: #ffffff light / #2E2E2C dark
--border-def: #E5E3DF      (dividers, input borders)
--border-muted: #EEECEA    (panel header/footer dividers)
--text-pri: #1a2740        (primary text)
--text-sec: #3d526b        (secondary text)
--text-muted: #607a96      (labels, muted text)
--r-sm: 8px  --r-md: 12px  --r-lg: 16px
```

### Form input tokens:
```
background:    var(--input-bg)
border:        1px solid var(--border-def)
border-radius: 4px
height:        36px
padding:       8px 11px
font:          13px / 400 / var(--text-pri)
```

### Footer button tokens:
```
Primary (Save):     bg var(--accent), height 36px, radius 4px, 12px/500, color #fff
Secondary (Cancel): bg var(--bg-page), border 1px solid var(--border-def), height 36px, radius 4px, 12px/500, color var(--text-sec)
```

### Panel dimensions:
```
Width: 380px default (Legal Entity view: 480px, edit: 520px, Add Entity: 440px)
Height: 100vh, position: fixed, right: 0, top: 0
Background: var(--card) | Left border: 1px solid var(--border-def)
Box shadow: -4px 0 16px rgba(0,0,0,0.20)
Header: padding 16px 24px 17px | border-bottom: 1px solid var(--border-muted)
Body:   padding 20px 24px
Footer: padding 17px 24px 16px | border-top: 1px solid var(--border-muted) | gap: 8px
```

### Page content:
```
padding: '32px 40px 80px'
No hardcoded maxWidth on page containers — content fills AppShell fluid area
```

---

## Reusable Components (src/components/ui/)

| Component | File | Props |
|---|---|---|
| RightPanel | RightPanel.tsx | title, subtitle, onClose, children, footer — Portal to body |
| PageTabBar | PageTabBar.tsx | tabs[], activeTab, onChange |
| DataTable | DataTable.tsx | columns[], rows[], onRowAction |
| TableActionButtons | TableActionButtons.tsx | view + edit + delete icons (each optional) |
| PriorityBadge | PriorityBadge.tsx | Signal-bars SVG + High/Medium/Low |
| MetaStrip | MetaStrip.tsx | Horizontal strip of labeled meta fields |
| SearchInput | SearchInput.tsx | Search input with icon |
| MultiSelectFilter | MultiSelectFilter.tsx | Filter pill + dropdown checkboxes |
| AvatarInitials | AvatarInitials.tsx | name, size |
| SectionLabel | SectionLabel.tsx | 11px/500/var(--text-muted) uppercase |
