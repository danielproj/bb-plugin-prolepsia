# Prolepsia for BB

A headless forecaster client using Prolepsia's Streamable HTTP MCP server.
Connects to https://app.prolepsia.com/api/v1/mcp/ with bearer authentication.
Includes native agent tools, a CLI, and Prolepsia's forecasting skill (version
2026-10-24.2), with a BB adapter appended. No frontend bundle is required.

## Setup

Run `npm ci`, `npm run typecheck`, `npm test`, and `bb plugin build` in this
folder. Install with `bb plugin install . --yes`.
In BB Settings → Installed plugins → Prolepsia, set the secret **Prolepsia API
key**. Create a key in Prolepsia Settings → API and AI clients, with
forecasts:read/write and questions:read/write as needed. Other tools may need
additional scopes. Settings are read on every request; no reload is needed.

## Usage

Ask your BB agent to discover tools with `prolepsia_tools`, then invoke a tool
with `prolepsia_call` using its exact schema. The CLI equivalents are:

- `bb prolepsia tools`
- `bb prolepsia call get_credit_balance`
- `bb prolepsia call list_forecasts --args '{"limit":10,"offset":0}'`
- `bb prolepsia call get_forecast --args '{"taskId":"YOUR_TASK_ID"}'`

`tools` accepts `--cursor` for subsequent schema pages. Both CLI commands
return JSON. A remote MCP tool error exits `call` with status 1 and preserves
its error response. All remote tools remain available through discovery,
including questions, forecasts, contexts, chat, schedules, watches and credits.

A forecast is paid and takes roughly 5–90 minutes, sometimes longer. Creation
returns a task ID immediately. Record and report that ID; check status later.
The client never retries automatically or cancels a remote run on disconnect.
If creation times out, inspect `list_forecasts` before starting another run.
No forecast has to be created to install or test this plugin.

Wait calls allow 1–55 seconds. Use pagination: `all=true` is rejected and
`limit` must be 1–100. Output over 500,000 characters raises instead of silently
truncating data; use narrower reads. Requests have a 70-second total deadline
and are closed on cancellation or plugin disposal. Authentication remains in
BB's server-side secret setting. This version uses API keys, not OAuth.

References: https://prolepsia.com/docs/developers and
https://prolepsia.com/docs/developers/mcp . The upstream skill source is
https://app.prolepsia.com/api/v1/mcp-skill/prolepsia.md .

## Brand assets

The full-color app icon is copied from https://app.prolepsia.com/apple-touch-icon.png.
The compact monochrome mark preserves the paths from https://app.prolepsia.com/favicon.svg.
Prolepsia branding belongs to its respective owner.
