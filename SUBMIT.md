# Windmill Hub — submission instructions

Real, form-based submission confirmed:
`hub.windmill.dev`, per Windmill's own docs — a Resource Type submission
form (name, integration, JSON Schema) plus separate script submission.
Verified resource types on the Hub "are directly added to the list of
available Resource types on each new Windmill instance synced with the
Hub" (their words) — a genuinely global distribution mechanism, not
per-workspace.

## What's here

```
resource_type.json                  the "anakin" resource type schema
scripts/scrape_url.ts               submit a scrape job
scripts/get_scrape_result.ts        poll it
scripts/search.ts                   synchronous AI search
scripts/agentic_search.ts           submit an agentic research job
scripts/get_agentic_search_result.ts  poll it
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

All 5 scripts **typecheck clean** — installed `typescript` in a scratch
dir, ran `tsc --noEmit` against all five files together with `lib: ["ES2020",
"DOM"]` (Windmill's TS runtime is Deno-based and provides global `fetch`
without an import, same as this checks for). Exit 0, no errors.

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
this hasn't been tested against).
