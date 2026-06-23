# Backend TODO

Frontend is wired to the API and ready to run, but several endpoints don't
yet return the data the UI expects. This file tracks each gap so a future
backend session can resolve them in one pass.

Each entry lists: what's missing, the current frontend workaround, and the
places in the frontend that are affected.

---

## 1. `GET /projects/:id`

**Status:** missing.
**Current workaround:** `app/dashboard/projects/[id]/page.tsx` fetches the
full company project list and filters client-side. This is fine for small
companies but doesn't scale and breaks once a user is in many companies.

**What frontend needs:** `GET /projects/:id` returning the same
`ProjectResponse` shape the list endpoint returns per item.

**Affects:**
- `app/dashboard/projects/[id]/page.tsx` — see the TODO at the top of the
  detail-page body.

---

## 2. `GET /companies/:id/users`

**Status:** missing.
**Current workaround:** three places in the frontend accept a raw `userId`
text input from the user. This is awkward UX and prevents any "directory"
or "search" affordance.

**What frontend needs:** a paginated, optionally-searchable directory
endpoint. Suggested shape: `GET /companies/:id/users?query=&page=&limit=`
returning `{ items: UserSummary[], nextPage: number | null }`. A
`UserSummary` should at minimum include `id`, `name`, `email`, and
`role` (member / pm / company_admin).

**Affects (3 places):**
- `components/projects/AddMemberModal.tsx` — currently a text input; should
  become a searchable picker.
- `app/dashboard/ask/page.tsx` — the user filter in the RAG query filter
  bar should become a picker.
- `app/dashboard/team/page.tsx` — the whole Team page should become a
  member directory with a stats panel, not a manual-id lookup.

---

## 3. `ConfidenceTrendPoint` shape mismatch

**Status:** endpoint exists but returns the wrong shape.
**Current workaround:** `components/analytics/ConfidenceTrendChart.tsx`
renders a single-area chart of `averageConfidence` over time. The product
spec wants a three-series stacked area (low / medium / high counts per
day) to surface the confidence mix over time.

**Current shape (per `types/analytics.types.ts`):**
```ts
interface ConfidenceTrendPoint {
    bucket: string;
    averageConfidence: number;
    sampleSize: number;
}
```

**What frontend needs:**
```ts
interface ConfidenceTrendPoint {
    bucket: string;       // date label, e.g. "2026-06-15"
    low: number;          // count of low-confidence updates that day
    medium: number;       // count of medium-confidence updates that day
    high: number;         // count of high-confidence updates that day
}
```

**Affects:**
- `components/analytics/ConfidenceTrendChart.tsx` — see the top-of-file
  TODO. The component will need to switch to three stacked `<Area>`
  series once the response shape changes.
- `app/dashboard/projects/[id]/page.tsx` — the Analytics tab.

---

## 4. `ProjectStats` missing fields

**Status:** endpoint exists but is missing several fields the Analytics tab
expects.

**Current shape (per `types/analytics.types.ts`):**
```ts
interface ProjectStats {
    projectId: string;
    totalUpdates: number;
    uniqueContributors: number;
    averageConfidence: number;
    blockerCount: number;
    lastActivityAt: string | null;
}
```

**What frontend needs:**
- `totalHours: number` — sum of `hoursSpent` across all updates in the
  project. Used in the summary stat row.
- `categoryBreakdown: Record<UpdateCategory, number>` — per-category count
  to drive the category bar chart.
- `perMemberBreakdown: Array<{
      userId: string;
      totalHours: number;
      updateCount: number;
      confidenceSplit: { low: number; medium: number; high: number };
  }>` — drives the per-member table with the inline stacked bar.

**Affects:**
- `app/dashboard/projects/[id]/page.tsx` — the Analytics tab. Two
  `GapCard` placeholders already mark where this data plugs in.
- `app/dashboard/page.tsx` — the "This week's activity" preview card could
  surface `totalHours` once available.

---

## 5. `UserStats` missing fields

**Status:** endpoint exists but the response is too thin to drive the
Team page properly.

**Current shape:**
```ts
interface UserStats {
    userId: string;
    totalUpdates: number;
    projectsContributed: number;
    averageConfidence: number;
    lastUpdateAt: string | null;
}
```

**What frontend needs:**
- `currentStreak: number` — number of consecutive days the user has
  submitted an update ending today. Drives the hero "streak" stat card
  (currently shows "—").
- `perProjectBreakdown: Array<{
      projectId: string;
      projectName: string;
      totalHours: number;
      updateCount: number;
      averageConfidence: number;
  }>` — drives the per-project table.
- `categoryBreakdown: Record<UpdateCategory, number>` — drives the
  category bar chart.

**Affects:**
- `app/dashboard/team/page.tsx` — see the inline amber banners and
  `GapCard` placeholders.

---

## Priority order (suggested)

1. **`GET /companies/:id/users`** — unblocks the most user-facing flows
   (AddMemberModal, Ask user filter, Team page). Highest impact.
2. **`ProjectStats` extensions** — the project Analytics tab is the
   second-most visible screen.
3. **`UserStats` extensions** — Team page is gated to privileged roles
   but it's a centerpiece feature.
4. **`ConfidenceTrendPoint` shape** — purely a visual upgrade; the
   single-area chart is already informative.
5. **`GET /projects/:id`** — lowest priority; the current workaround
   works fine for small companies and can be refactored any time.
