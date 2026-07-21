# FullEnrich Structure Lab — Version Summary

## V1 — Current (Baseline)
Nav: Search > Enrichment > Reverse Lookup > API Console > Integrations
- Flat structure, every feature is a nav item
- No lists concept
- No jobs concept
- Enrichment results are siloed per feature

## V2 — B2B Data Engine
Nav: Search > Enrichment > Lists > Integrations
- Introduced Find / Enrich / Push model
- SubNav for People/Companies in Search, Emails/Reverse/CRM in Enrichment
- Lists as a separate section with contact tables
- No link between enrichment results and lists

## V3 — Lusha's Model
Nav: Search > Enrichment > Lists > Integrations
- Added "All Contacts" global view alongside Lists
- Enriched contacts flow into a global contact database
- Lists are organizational groupings on top of the global DB

## V4 — Find, Enrich, Push
Nav: Search > Enrichment > Lists > Integrations
- Unified lists, universal Export action
- Enrichment from search goes to a list
- CSV/manual enrichments are standalone jobs
- Optional list organization

## V6 — Jobs + Parallel Lists
Nav: Search > Lists > Enrichment > Integrations
- Introduced Jobs as a first-class object (enrichment results container)
- Lists exist in parallel — separate from jobs
- One enrichment launcher for all types
- Universal export from both jobs and lists
- Problem: two places to find contacts (jobs AND lists)

## V7 — Lists Only
Nav: Search > Lists > Enrichment > Integrations
- Lists as the single object — no separate jobs
- Enrichment is a launcher + activity feed, results flow into lists
- Onboarding screen routes users to the right section
- Problem: inline enrichment from search — where do contacts go?

## V8 — Auto Lists + Jobs
Nav: Search > Lists > Enrichment > Integrations
- Every enrichment auto-creates a list (or enriches in-place)
- Auto-created lists have provenance tags (from CSV, from Search, etc.)
- Users can pick a target list or let one be auto-created
- "Make permanent" action for auto-created lists
- Problem: enrichment job detail duplicates the list detail UI

## V9 — Production (Final)
Nav: Search > Lists > Enrichment > Integrations
- **One object: Lists.** No separate jobs.
- Enrichment = launcher + activity log (no contact table)
- Activity log links to lists, not to job detail pages
- Every enrichment creates or feeds a list
- Destination choice before launch: auto-create or merge into existing
- Default views: Lists / All Contacts / All Companies
- People lists + Company lists
- Contacts are global — same person across multiple lists shares data
- Search inline enrichments grouped into one auto-list per session/filters (rule TBD)
- Workspace features: ownership, shared vs personal lists

### V9 — Open questions (non-blocking)
- Duplicate handling on merge (warn + let user choose)
- Deleting a list: contacts persist globally
- Search inline grouping rule (session-based, filter-based, or both)
- CRM sync: one-time push vs ongoing sync

### V9 — Enterprise blind spots (to address)
- CRM exclusion filter in Search ("exclude contacts already in Salesforce")
- Cross-rep visibility ("already enriched by teammate" badges in search)
- Shared vs Personal vs Workspace lists (visibility/permission levels)
- Credits tracking per user
