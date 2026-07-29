# Windmill Hub — submission instructions

Real, form-based submission confirmed:
`hub.windmill.dev`, per Windmill's own docs — a Resource Type submission
form (name, integration, JSON Schema) plus separate script submission.
Verified resource types on the Hub "are directly added to the list of
available Resource types on each new Windmill instance synced with the
Hub" (their words) — a genuinely global distribution mechanism, not
per-workspace.

## What's here

28 scripts covering all 21 capabilities on the ground-truth surface
(`anakin-mcp/src/client.ts` + `anakin-mcp/src/tools/*.ts`) — the original 5
plus 23 new ones for the remaining 16 endpoint families (several split into
submit/poll pairs, matching the existing scrape_url/get_scrape_result
convention). Full list and one-line descriptions in `README.md`.

```
resource_type.json                    the "anakin" resource type schema
scripts/scrape_url.ts                 submit a scrape job
scripts/get_scrape_result.ts          poll it
scripts/search.ts                     synchronous AI search
scripts/agentic_search.ts             submit an agentic research job
scripts/get_agentic_search_result.ts  poll it
scripts/map.ts                        submit a site-mapping job
scripts/get_map_result.ts             poll it
scripts/crawl.ts                      submit a crawl job
scripts/get_crawl_result.ts           poll it
scripts/wire_discover.ts              Wire: intent -> candidate actions
scripts/wire_catalog.ts               Wire: browse the action catalog
scripts/wire_read_action.ts           Wire: run a read (data-extraction) action
scripts/wire_write_action.ts          Wire: run a write (state-changing) action
scripts/get_wire_job_result.ts        poll a Wire job (if async)
scripts/wire_identities.ts            Wire: list saved identities/credentials
scripts/wire_login.ts                 Wire: credentials-mode sign-in
scripts/wire_build.ts                 Wire: request a new action
scripts/monitor_create.ts             create a scheduled website monitor
scripts/monitor_list.ts               list monitors / fetch one
scripts/monitor_changes.ts            a monitor's detected changes
scripts/monitor_control.ts            pause/resume/run_now/delete a monitor
scripts/ai_visibility_search.ts       submit a multi-engine AI visibility query
scripts/get_ai_visibility_result.ts   poll it
scripts/ai_visibility_sources.ts      list available AI engines
scripts/session_list.ts               list saved browser sessions
scripts/session_delete.ts             delete a saved browser session
scripts/browser_task.ts               submit a natural-language browser task
scripts/get_browser_task_result.ts    poll it
README.md                             full script reference
```

## Verified, not assumed

The resource-typed-parameter convention (`type Anakin = { api_key: string
}` as a TS parameter type, matched structurally by Windmill's UI to a
resource) was checked against two separate current doc pages
(`code_editor/add_variables_resources` and a corroborating search result on
`code_editor/parameter_inference`) — both show the same direct-type-
definition pattern, no special import or `RT.` namespace needed for
authoring a *new* custom resource type (that namespace is for consuming
already-hub-verified types with generated bindings — different from what
we're submitting).

All 28 scripts **typecheck clean** — installed `typescript` (v7.0.2) in a
scratch dir, ran `tsc --noEmit --strict` against every file in `scripts/`
together with `target ES2020`, `lib: ["ES2020", "DOM"]` (Windmill's TS
runtime is Deno-based and provides global `fetch` without an import, same
as this checks for). Exit 0, no errors. `node --check` was also tried per
file; it fails uniformly on every script old and new (`SyntaxError:
Unexpected identifier`) because these are TypeScript, not plain JS —
expected, and not a signal of anything wrong; `tsc --noEmit` is the real
check, as it was for the original 5.

Wire's read/write split (`wire_read_action.ts` / `wire_write_action.ts`)
hits the same `POST /wire/task` endpoint — they're separate scripts purely
so each carries an honest description of its own safety class (read-only
vs state-changing), mirroring the split in `anakin-mcp/src/tools/wire.ts`.

The Anthropic Connectors Directory policy layer in
`anakin-mcp/src/tools/policy.ts` (financial-transaction blocking) and
`anakin-mcp/src/tools/index.ts` (MCP tool annotations, result-size capping)
is MCP/Connectors-Directory-specific — it doesn't apply to Windmill's
resource/script submission model, so it wasn't ported. The one piece of
`monitor.ts` that *is* general (the `alertWebhookSecret` redaction, since a
raw HMAC secret shouldn't land in a Windmill run's output/log regardless of
distribution channel) was kept, in `monitor_create.ts` / `monitor_list.ts` /
`monitor_changes.ts` / `monitor_control.ts`.

## Steps (needs the account owner)

1. Submit `resource_type.json`'s contents via the Hub's resource type
   submission form.
2. Submit each script via the Hub's script submission flow, referencing the
   `anakin` resource type for the `anakin: Anakin` parameter.
3. Never tested inside an actual Windmill workspace against a live API key
   — do that before or alongside submission.

## Not done

Typechecks standalone; never run inside Windmill itself (which also
provides `wmill` client bindings and its own resource-resolution runtime
this hasn't been tested against). The submit/poll pairs (map, crawl,
wire_read_action/wire_write_action, ai_visibility_search, browser_task)
haven't been wired into an actual Windmill Flow with a Sleep/retry step —
that assembly, and confirming the Flow UI's Sleep-and-retry pattern works
as expected end-to-end, still needs to happen against a live workspace.
