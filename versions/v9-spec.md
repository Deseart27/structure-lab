# V9 — Full Specification

## Core Principle

**One object: Lists.** Every contact and every company lives in a list. Lists are the only navigable data object in the application. There is no separate "job" or "enrichment result" container.

**Jobs exist as activity, not as objects.** A job is any enrichment action performed on a list (find emails, find phones, reverse enrich, etc.). Jobs are stored as metadata and displayed in the context of their list. They are never standalone — they always belong to a list.

---

## Navigation

**Search** > **Lists** > **Enrichment** > **Integrations**

---

## Data Model

### Contact (Person)
A person with enrichment data. Contacts are **global** — the same person in multiple lists shares the same underlying data. Enriching Jean Morel in List A updates his data everywhere.

### Company
A company with firmographic data (industry, headcount, funding, financials, technographics). Companies are global, like contacts.

### List
A group of contacts OR companies. The primary object users interact with.

- **People list**: contains contacts
- **Company list**: contains companies
- Can be manually created or auto-created from enrichment
- Has an owner and visibility level (personal, shared, workspace — TBD)
- Tracks enrichment activity (jobs) that happened on it

### Job (Enrichment Action)
An enrichment action that happened on a list. Not a navigable object — metadata and activity history.

A job records:
- What was requested (find emails, find phones, reverse enrich, full enrichment)
- Input method (CSV, manual, CRM, API, search inline, from list)
- How many contacts were involved
- How many were found
- Status (queued, running, completed)
- When it started

A list can have many jobs over time. Examples:
- List created from CSV upload + asked for emails = job 1
- 10 days later, selected 5 contacts in the same list + asked for phones = job 2
- Re-enriched the whole list for emails = job 3

---

## Sections

### 1. Search

Find people and companies using filters (job title, location, industry, headcount, seniority, etc.).

**People search**: Browse 700M+ contacts. Enrich inline (find email, find phone) directly from search results.

**Company search**: Browse companies by industry, size, location, funding, etc. Save companies to a company list.

**Inline enrichment behavior**: When a user enriches contacts from search:
- An auto-created list is generated based on the search criteria (e.g., "VP Sales . SaaS . France . Jul 21")
- Multiple inline enrichments from the same search in the same session are grouped into the same auto-created list
- The exact grouping rule (session-based, filter-based, or both) is TBD
- The user can also choose to add enriched contacts to an existing list (advanced)

**SubNav**: People | Companies (for switching between search types)

### 2. Lists

Where ALL contacts and companies live. The main data section of the application.

**Three default views:**

| View | What it shows |
|---|---|
| **Lists** | All user-created and auto-created lists. Filterable by type (people/company), ownership, source. |
| **All Contacts** | Every person in the workspace across all lists. Shows which list(s) each belongs to. Global view. |
| **All Companies** | Every company in the workspace across all lists. Global view. |

**List table columns**: Type, Name, Count, Enrichment status, Last enrichment, Sources, Owner, Updated, Actions

**Auto-created lists**:
- Have a provenance tag showing origin ("from CSV: leads_q3.csv", "from Search: VP Sales . SaaS . France")
- Displayed with a dashed "auto" badge
- Can be renamed, merged into other lists, or "made permanent" by the user
- Behave identically to manual lists in every other way

**Actions available from a list**: Export CSV, Push to CRM (HubSpot, Salesforce), Push to engagement tools (Lemlist, Smartlead, etc.), Enrich, Add contacts, Import

**List detail page**:
- Full contact/company table with all data columns
- Enrichment status per contact (email status, phone, last enriched)
- Enrichment activity section showing jobs that happened on this list
- Ability to filter contacts by job/source (e.g., "show me only the contacts from CSV 3")
- Export, push, enrich actions in the header

**Company lists**:
- Created from company search results, CSV import, or manual creation
- Show company data: name, domain, industry, headcount, location, funding, financials
- Can unlock funding and financials data (credits)

### 3. Enrichment

The enrichment section serves two purposes: **launching new enrichments** and **viewing recent enrichment activity**.

**Launcher** — Four enrichment types:

| Type | Description | Color |
|---|---|---|
| Find Emails | Professional email addresses | Violet |
| Find Phones | Direct phone numbers | Blue |
| Reverse Enrich | Have emails? Get full profiles (name, title, company, LinkedIn, phone) | Teal |
| Full Enrichment | Emails + Phones in one go | Amber |

**Input methods**: CSV upload, Manual entry, CRM pull (HubSpot, Salesforce), From existing list, API

**Enrichment flow (modal)**:
1. Choose enrichment type (find emails, phones, reverse, full)
2. Choose input method (CSV, manual, CRM, from list)
3. Provide contacts (upload file, enter names, select CRM list, pick existing list)
4. Choose destination:
   - **Auto-create a new list** (default) — named from context (filename, search criteria, timestamp)
   - **Add to an existing list** (advanced) — user picks from their lists
   - **Enrich in-place** (when input is "from existing list") — no new list created
5. Launch enrichment

**Activity log**:
- Shows recent enrichment jobs, always in the context of their parent list
- Grouped or displayed so the user always sees which list each job belongs to
- Each row shows: enrichment type, input method, contact count, found count, status, progress, started date, target list
- Clicking a job navigates to the list with context about that specific job (smart filtering/highlighting — exact UX TBD)
- No standalone job detail page

**API enrichments**:
- API batch enrichments appear in the activity log like any other job
- Auto-create a list by default ("API enrichment . Jul 21 14:32")
- API can optionally pass a list_id to merge results into an existing list

### 4. Integrations

**CRM** (HubSpot, Salesforce):
- Connect CRM accounts
- Push contacts/lists to CRM
- Pull contacts from CRM for enrichment
- CRM exclusion filter in search (TBD — enterprise feature)

**Engagement tools** (Lemlist, Smartlead, Instantly, Outreach, Salesloft, HeyReach):
- Push enriched contacts directly to engagement tools

**API & MCP**:
- API key management
- API enrichment history (visible in the main activity log)
- MCP integration

**SubNav**: CRM | Engagement | API & MCP

---

## User Flows

### Basic user — CSV enrichment
1. Click **Enrichment** in nav
2. Select "Find Emails"
3. Upload CSV (85 contacts)
4. Destination: auto-create (default)
5. Launch → list "leads_q3.csv" created
6. Redirected to the list → see results → export/push
7. Done. Never touched the Lists section.

### Basic user — Search + inline enrich
1. Go to **Search**
2. Filter: VP Sales, SaaS, France
3. Select 5 contacts → click "Find Emails"
4. Auto-creates list "VP Sales . SaaS . France . Jul 21"
5. Go to page 3, enrich 3 more → added to the same auto-list
6. Go to **Lists** or **Enrichment** activity log → find the list → export/push

### Advanced user — Merge into existing list
1. Click **Enrichment**
2. Upload CSV 2 (15 contacts)
3. Destination: pick existing list "Q3 Targets"
4. Launch → 15 contacts merged into "Q3 Targets" (with duplicate warning if overlap)
5. Activity log shows a new job on "Q3 Targets"

### Advanced user — Re-enrich a list
1. Go to **Lists** → open "Q3 Targets"
2. Select 10 contacts → click "Find Phones"
3. Job runs on the same list, in-place
4. Phone data appears on those contacts when done

### API user
1. API batch enrichment call with 200 contacts
2. Auto-creates list "API enrichment . Jul 21 14:32" (or merges if list_id provided)
3. Appears in activity log + Lists section

### Enterprise team — 30 reps
1. Each rep enriches via CSV, search, CRM pull → all create lists
2. **All Contacts** view shows everyone in the workspace
3. Lists have ownership — reps see "My lists" vs "Team lists"
4. Before enriching, system warns about duplicates ("15 already enriched by your team")
5. Search can exclude contacts already in CRM (enterprise feature — TBD)

---

## Workspace Features

### Default views
- **Lists**: all lists (filterable by mine, shared, all)
- **All Contacts**: global people view across all lists
- **All Companies**: global company view across all lists

### Ownership & visibility (TBD — enterprise)
- Each list has an owner
- Visibility levels: Personal (only me), Shared (team), Workspace (everyone)
- Admin-managed workspace lists (e.g., "Do Not Contact")

### Contact deduplication
- Contacts are global — same person in multiple lists shares data
- On merge: warn user about duplicates, let them choose (skip, update, etc.)
- Cross-rep: "already in workspace" indicators in search results (TBD)

---

## Open Questions (Non-blocking)

| Question | Current stance | Priority |
|---|---|---|
| Search inline grouping rule | Group by search criteria + session. Exact rule TBD. | Medium |
| Duplicate handling on merge | Warn + let user choose (skip/update). | Medium |
| Deleting a list | Contacts persist in global view, list grouping removed. | Low |
| CRM sync model | One-time push for now. Ongoing sync TBD. | Low |
| Job display in activity log | Grouped by list, with job detail inline. Exact UX TBD. | High |
| Clicking a job in activity log | Redirects to list with smart filter for that job's contacts. Exact UX TBD. | High |

---

## Enterprise Blind Spots (To Address)

| Blind spot | Impact | Priority |
|---|---|---|
| CRM exclusion filter in Search | Core workflow for teams: "find leads not in my CRM" | High |
| Cross-rep visibility | Prevent duplicate enrichment + outreach across reps | High |
| Shared vs Personal lists | Teams need both personal workspace and shared resources | High |
| Credits tracking per user | 30 reps sharing credits need usage visibility | Medium |
| Role-based permissions | Who can export, push, delete, manage integrations | Medium |
