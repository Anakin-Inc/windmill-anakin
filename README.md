# windmill-anakin

Windmill scripts for the [Anakin](https://anakin.io) API (`api.anakin.io`) —
web scraping, site mapping/crawling, AI search, multi-stage agentic
research, the Wire site-automation catalog, website change monitoring, AI
answer-engine visibility, saved browser sessions, and AI browser automation.

All scripts share one resource type, `anakin` (`resource_type.json`), which
holds a single `api_key` field. Get a free key (500 credits, no card
required) at https://anakin.io/dashboard.

## Convention

Every script is a standalone Windmill TypeScript script: a single `main()`
export, an `anakin: Anakin` resource-typed first parameter for auth, plain
`fetch` calls (Windmill's Deno runtime provides `fetch` globally — no
import), and a thrown `Error` on a non-2xx response.

Async API endpoints (map, crawl, agentic search, Wire actions, AI
visibility search, browser tasks) follow a **submit / get-result** pair
instead of blocking in a loop: the submit script returns immediately with a
job id, and a paired `get_*_result.ts` script polls it once. Chain them in a
Windmill Flow with a Sleep step in between (retry the get-result step until
the job's `status` is terminal) — this keeps each script's own runtime
short and avoids tying up a Windmill worker for minutes at a time.
The one exception is `scrape_url_and_wait.ts`: a single page usually
finishes in seconds, so it submits and polls in one step.

## Scripts

### Scraping & discovery

| Script | Endpoint | Notes |
|---|---|---|
| `scrape_url_and_wait.ts` | `POST /url-scraper` + `GET /url-scraper/:jobId` | one step: submits and polls every 3s until done (default 180s cap) |
| `scrape_url.ts` | `POST /url-scraper` | submit — pair with `get_scrape_result.ts` |
| `get_scrape_result.ts` | `GET /url-scraper/:jobId` | poll |
| `map.ts` | `POST /map` | submit — discover a site's URLs; pair with `get_map_result.ts` |
| `get_map_result.ts` | `GET /map/:jobId` | poll |
| `crawl.ts` | `POST /crawl` | submit — bulk-fetch markdown across pages; pair with `get_crawl_result.ts` |
| `get_crawl_result.ts` | `GET /crawl/:jobId` | poll |

### Search

| Script | Endpoint | Notes |
|---|---|---|
| `search.ts` | `POST /search` | synchronous, no polling |
| `agentic_search.ts` | `POST /agentic-search` | submit — pair with `get_agentic_search_result.ts` |
| `get_agentic_search_result.ts` | `GET /agentic-search/:jobId` | poll |

### Wire (pre-built site-automation catalog)

| Script | Endpoint | Notes |
|---|---|---|
| `wire_discover.ts` | `GET /wire/resolve` | natural-language intent → ranked candidate actions |
| `wire_catalog.ts` | `GET /wire/catalog[/:slug]` | list catalogs, or one catalog's full action list |
| `wire_read_action.ts` | `POST /wire/task` | run a read (data-extraction) action; may return inline or `{ job_id }` |
| `wire_write_action.ts` | `POST /wire/task` | run a write (state-changing) action — same endpoint, split for an honest safety label |
| `get_wire_job_result.ts` | `GET /wire/jobs/:jobId` | poll, only if the submit returned a `job_id` |
| `wire_identities.ts` | `GET /wire/identities` | list saved identities/credentials |
| `wire_login.ts` | `POST /wire/login` | credentials-mode sign-in → a `credential_id` |
| `wire_build.ts` | `POST /wire/build-request` | request a new action for a site not yet in the catalog |

### Website monitoring

| Script | Endpoint | Notes |
|---|---|---|
| `monitor_create.ts` | `POST /monitors` | scheduled watch of a page, site, or Wire action |
| `monitor_list.ts` | `GET /monitors` or `GET /monitors/:id` | list, or fetch one |
| `monitor_changes.ts` | `GET /monitors/:id/changes` | detected changes |
| `monitor_control.ts` | `POST /monitors/:id/pause\|resume\|run`, `DELETE /monitors/:id` | pause / resume / run_now / delete |

`monitor_create.ts` / `monitor_list.ts` / `monitor_changes.ts` /
`monitor_control.ts` redact the API's `alertWebhookSecret` field before
returning — an HMAC signing secret that shouldn't land in a Windmill run's
output/log. Retrieve the real value from the Anakin dashboard.

### AI visibility

| Script | Endpoint | Notes |
|---|---|---|
| `ai_visibility_search.ts` | `POST /ai-visibility/search` | submit — pair with `get_ai_visibility_result.ts` |
| `get_ai_visibility_result.ts` | `GET /ai-visibility/search/:searchId` | poll |
| `ai_visibility_sources.ts` | `GET /ai-visibility/sources` | list available AI engines |

### Browser sessions & automation

| Script | Endpoint | Notes |
|---|---|---|
| `session_list.ts` | `GET /sessions` | list saved (encrypted) browser sessions |
| `session_delete.ts` | `DELETE /sessions/:id` | irreversible |
| `browser_task.ts` | `POST /ai/evaluate` (async) | submit a natural-language browser task; pair with `get_browser_task_result.ts` |
| `get_browser_task_result.ts` | `GET /ai/jobs/:id` | poll |

Creating a browser session is a live, interactive dashboard flow (login,
2FA/captchas) and isn't exposed as a script — `session_list.ts` /
`session_delete.ts` cover discovery and cleanup.

## Not covered

Nothing from the ground-truth surface (`anakin-mcp/src/client.ts` and
`anakin-mcp/src/tools/*.ts`) was left out — all 21 capabilities (the
original 5 plus 16 endpoint families, several split into submit/poll pairs)
have a script.

## Verification

`tsc --noEmit --strict` (TypeScript 7.0.2, `target ES2020`, `lib
["ES2020","DOM"]` — Windmill's Deno-based TS runtime provides global
`fetch` without an import, same as this checks for) against every script in
`scripts/`: exit 0, no errors. Every script was also run under Bun
(Windmill's default TypeScript runtime) against the live API; see `SUBMIT.md`. See `SUBMIT.md` for the full verification
log and Hub submission steps.
