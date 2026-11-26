---
name: prolepsia
description: "Probabilistic forecasting via the Prolepsia MCP server. Use whenever the user asks for a forecast, probability, prediction, or calibrated estimate of any future event (\"forecast X\", \"what's the probability of X\", \"predict X\", \"how likely is X\"), and whenever they ask about a forecast already running (\"is my forecast done\", \"check on forecast X\", \"what have I forecasted\"). Do not use for past events - those are search/research questions, not forecasts."
---

# Prolepsia forecasting skill

Skill version: 2026-10-24.2

<!-- prolepsia:skill-version: 2026-10-24.2 -->

You have access to the Prolepsia MCP tools listed below. They generate
probabilistic forecasts with sources. Use them whenever the user asks for
a probability, prediction, or calibrated estimate of a future event.

## Keeping this skill current

This file is a copy and does not update itself. The Prolepsia MCP server
states the current skill version in its instructions each time you connect.
https://app.prolepsia.com/api/v1/mcp-skill/version answers with the same `version`,
plus `skill_url` (this text with its Claude Code header, for SKILL.md) and
`plain_url` (the plain text, for a rules file that holds only this skill).

When that version differs from the one at the top of this file, tell the user
this skill is out of date. Replace this file with the matching download only
when it is a file of its own that holds nothing but this skill. When this text
sits inside a larger file such as AGENTS.md, do not overwrite that file: tell
the user instead. Compare versions for equality only.

## How long a forecast takes — read this first

**A Prolepsia forecast takes 5-90 minutes, depending on its run mode, and
a deep run can take longer.** It is not a fast tool call. Everything else
in this skill follows from that:

- `create_forecast` returns in about a second with a `taskId`. The run
  then continues **server-side**. Closing the session, losing the
  connection, or a failed tool call does not cancel it.
- Tell the user the `taskId` and the expected wait **immediately**,
  before you do anything else. An agent that goes quiet for forty
  minutes looks broken.
- Never block waiting for the whole run in one call. `wait_for_forecast`
  is capped at 55 seconds — far less than one forecast — so use it as one
  brief status check, then poll every few minutes only while the session
  remains active. See "Watching a run".
- **Never call `create_forecast` twice for the same question** because
  no result arrived. That starts a second paid run and answers nothing.
- **Never call `cancel_forecast`** because a wait came back early or a
  tool call errored. Cancel only when the user asks to abandon the run.

## Tools

<!-- prolepsia:signatures:start -->
```text
accept_forecast_context({ messageId, rerunNow = false, treatment = "consider", targetSubforecastIndex = null })
add_question_note({ questionId, text, treatment = "consider", targetSubforecastIndex = null })
cancel_forecast({ taskId })
chat_with_forecast({ taskId, message, threadId = null })
clarify_question({ title, draft, completionSession, clarification, answer })
create_forecast({ question = null, questionId = null, sourceForecastId = null, context = null, idempotencyKey = null, allowIncompleteContext = false, runMode = null, presetId = null, connections = null, prolepsiaRecords = null })
create_question({ question, context = null })
create_share_link({ questionId, label = "", expiresAt = null })
delete_schedule({ questionId })
delete_share_link({ questionId, linkId })
delete_watch({ questionId })
get_forecast({ taskId, includeSubforecasts = false })
get_forecast_chat({ taskId, threadId })
get_question({ questionId })
get_question_subscription({ questionId })
get_schedule({ questionId })
get_credit_balance()
get_watch({ questionId })
import_question({ reference, templateId = null, templateValues = null })
list_forecast_chats({ taskId })
list_forecasts({ limit = 50, offset = 0, status = null, questionId = null, all = false })
list_question_context({ questionId })
list_questions({ limit = 50, offset = 0, all = false, tag = null, q = "", scope = null, questionType = null, source = null, forecastStatus = "any", resolutionStatus = "any", sort = "created_desc" })
list_run_modes()
list_schedules({ limit = 50, offset = 0, status = null, all = false })
list_share_links({ questionId })
list_tags({ limit = 50, offset = 0 })
list_watches({ limit = 20, cursor = null, enabled = null })
normalize_question({ title, draft = null, templateId = null })
remove_question_file({ questionId, fileId })
remove_question_note({ questionId, noteId })
replace_question_file({ questionId, fileId, filename, contentBase64 })
revise_question({ title, draft, guidance, completionSession = "" })
revoke_share_link({ questionId, linkId })
set_question_subscription({ questionId, enabled = true })
set_question_tags({ questionId, tags })
set_schedule({ questionId, intervalCount, intervalUnit, endAt, startAt = null, presetId = null })
set_watch({ questionId, enabled = true, changeThreshold = null, presetId = null })
update_question({ questionId, changes })
update_question_file({ questionId, fileId, artifactType = null, treatment = null, targetSubforecastIndex = null, userNote = null, publicData = null, clearTarget = false })
update_question_note({ questionId, noteId, changes })
update_share_link({ questionId, linkId, changes })
upload_question_file({ questionId, filename, contentBase64, userNote = null, treatment = "consider", artifactType = "user_context", targetSubforecastIndex = null })
wait_for_forecast({ taskId, timeoutSeconds = 30, pollIntervalSeconds = 10, includeSubforecasts = false })
wait_for_question_context({ questionId, timeoutSeconds = 30 })
create_webhook({ url, description = "", enabled = true, eventKinds = null })
list_webhooks({ limit = 20, cursor = null })
get_webhook({ webhookId })
update_webhook({ webhookId, changes })
delete_webhook({ webhookId })
rotate_webhook_secret({ webhookId })
test_webhook({ webhookId })
list_webhook_deliveries({ webhookId = null, status = null, limit = 20, cursor = null })
get_webhook_delivery({ deliveryId })
list_webhook_delivery_attempts({ deliveryId, limit = 20, cursor = null })
replay_webhook_delivery({ deliveryId })
list_connections()
get_connection({ connectionId })
create_connection({ scope, name, url, authKind = "none", apiKey = null, apiKeyHeader = "Authorization" })
update_connection({ connectionId, changes })
delete_connection({ connectionId, confirm = false })
set_connection_member_switch({ connectionId, enabled })
test_connection({ connectionId })
start_connection_sign_in({ connectionId })
list_forecast_presets()
get_forecast_preset({ presetId })
create_forecast_preset({ scope, name, description = null, disabledConnectionIds = null, notes = null })
update_forecast_preset({ presetId, changes })
delete_forecast_preset({ presetId, confirm = false })
upload_forecast_preset_file({ presetId, filename, contentBase64, artifactType = null, treatment = null, userNote = null })
update_forecast_preset_file({ presetId, fileId, changes })
delete_forecast_preset_file({ presetId, fileId })
get_forecast_preset_defaults()
set_forecast_preset_defaults({ changes })
list_question_templates({ scope = null })
get_question_template({ templateId })
create_question_template({ scope, name, questionType, description = null, fields = null, blanks = null, draftingGuidance = null, tags = null, shareWithOrganization = null, forecastPresetId = null, notes = null })
update_question_template({ templateId, changes })
delete_question_template({ templateId, confirm = false })
save_question_as_template({ questionId, scope, name, description = null })
fill_question_template({ templateId, prompt, templateValues = null })
upload_question_template_file({ templateId, filename, contentBase64, artifactType = null, treatment = null, userNote = null })
update_question_template_file({ templateId, fileId, changes })
delete_question_template_file({ templateId, fileId })
get_question_file({ questionId, fileId })
list_question_forecasts({ questionId, limit = 20, cursor = null, status = "completed", fields = null })
list_forecast_results({ limit = 20, cursor = null, scope = null, status = null, questionIds = null, taskIds = null, autoforecast = null, fields = null })
create_forecast_batch({ items, idempotencyKey = null })
cancel_many_forecasts({ taskIds })
list_decisions({ status = "active", limit = 50, offset = 0 })
list_decisions_needing_attention({ limit = 20, timeZone = null })
dismiss_decision_attention({ decisionId, reasons, via = null })
list_decision_intake_sessions()
start_decision_intake_session({ message = null, templateId = null })
get_decision_intake_session({ sessionId })
save_decision_intake_session({ sessionId, version, message = null, draft = null, prepared = null, step = null, templateId = null })
discard_decision_intake_session({ sessionId })
reply_decision_intake_session({ sessionId, version })
prepare_decision_intake_session({ sessionId, version })
create_decisions_from_intake_session({ sessionId, version })
get_decision_research_plan({ decisionId, runMode = null })
defer_decision_plan_entries({ decisionId, entryIds, deferred })
remove_decision_plan_entries({ decisionId, entryIds })
approve_decision_research_plan({ decisionId, entryIds, expectedPricePerForecast = null, runMode = null, idempotencyKey = null })
create_decision({ title, context, decideBy, options, idempotencyKey = null, templateId = null })
get_decision({ decisionId })
update_decision({ decisionId, changes })
archive_decision({ decisionId, archived = true })
generate_decision_questions({ decisionId, kind = "more", sourceNodeId = null, templateId = null })
review_decision_drafts({ decisionId, action, draftIds })
convert_decision_work({ decisionId, direction, draftId = null, itemId = null, kind = null, questionType = null })
check_decision_questions({ decisionId })
review_question_flag({ decisionId, flagId, action, kind = null })
add_question_to_decision({ decisionId, questionId = null, templateId = null, templateValues = null, optionIds = null, includeInLiveMode = null, maxFeeCredits = null })
remove_question_from_decision({ decisionId, nodeId })
link_decision_questions({ decisionId, type, sourceNodeId, targetNodeId, condition = null, preset = null })
edit_decision_link({ decisionId, linkId, condition = null, preset = null })
remove_decision_link({ decisionId, linkId })
add_decision_note({ decisionId, text, type = "consider" })
edit_decision_note({ decisionId, noteId, text = null, type = null })
remove_decision_note({ decisionId, noteId })
list_decision_comments({ decisionId })
add_decision_comment({ decisionId, body, nodeId = null, linkId = null, parentId = null })
list_decision_conditions({ decisionId })
save_decision_condition({ decisionId, conditionId = null, text = null, nodeIds = null, intervalHours = null, armed = null, delete = null })
list_decision_criteria({ decisionId })
save_decision_criterion({ decisionId, criterionId = null, kind = null, text = null, weight = null, measure = null, clearWeight = null, clearMeasure = null, confirmed = null, criterionIds = null, delete = null, idempotencyKey = null })
get_decision_comparison({ decisionId })
save_decision_assessment({ decisionId, optionId, criterionId, action, state = null, nodeIds = null, itemIds = null, note = null })
save_decision_payoff_model({ decisionId, action, scenarioNodeId = null, unit = null, lossLimit = null, payoffs = null })
get_decision_review_updates({ decisionId })
save_decision_review_trigger({ decisionId, criterionId, action, kind = null, limitPercent = null })
get_decision_ownership({ decisionId })
transfer_decision({ decisionId, newOwnerId, idempotencyKey = null })
acknowledge_decision_handover({ decisionId })
get_decision_evidence({ decisionId, kind, id, summaryId = null, audience = null })
get_decision_brief({ decisionId, summaryId, audience = null })
list_decision_choices({ decisionId })
save_decision_choice({ decisionId, action, kind = null, optionId = null, rationale = null, responsibleUserId = null, responsibleName = null, decidedAt = null, summaryId = null, changeReason = null, review = null, actions = null, reason = null, keepMonitoring = null, acceptOpenChecks = null, idempotencyKey = null })
save_decision_next_action({ decisionId, action, itemId = null, text = null, why = null, ownerUserId = null, ownerName = null, dueDate = null, commitmentId = null, optionIds = null, criterionIds = null, completionNote = null, newFact = null, idempotencyKey = null })
save_decision_review({ decisionId, action, reviewId = null, dueDate = null, conditionText = null, outcome = null, reason = null, notes = null, nextReview = null, newChoice = null, keepMonitoring = null, idempotencyKey = null })
set_decision_reminder_emails({ decisionId, emailEnabled })
list_decision_items({ decisionId })
save_decision_item({ decisionId, itemId = null, kind = null, text = null, why = null, howToComplete = null, confirmed = null, optionIds = null, criterionIds = null, sourceUrl = null, sourceNote = null, ownerUserId = null, ownerName = null, dueDate = null, status = null, completionNote = null, delete = null, idempotencyKey = null })
estimate_decision_forecasts({ decisionId, runMode = null, nodeIds = null })
start_decision_forecasts({ decisionId, runMode = null, nodeIds = null, maxTotalCredits = null, expectedPricePerForecast = null, idempotencyKey = null, presetId = null, connections = null, prolepsiaRecords = null })
get_decision_summary({ decisionId })
refresh_decision_summary({ decisionId })
estimate_decision_live({ decisionId, runMode, monthlyCapCredits = null, questionId = null })
set_decision_live({ decisionId, enabled, runMode = null, monthlyCapCredits = null, maxFeeCredits = null, idempotencyKey = null, presetId = null })
set_decision_node_monitoring({ decisionId, nodeId, include, maxFeeCredits = null })
answer_decision_live_continuation({ decisionId, keepMonitoring, timeZone = null })
set_decision_follow({ decisionId, following })
```
<!-- prolepsia:signatures:end -->

- Use `get_question` to inspect an existing definition before editing or rerunning.
- `update_question` and `update_question_note` accept a `changes` object;
  omitted fields stay unchanged and an explicit null clears a note's target.
- `list_questions` supports text, source, type, scope, forecast and resolution
  filters plus sorting. Use `scope="organization"` for shared work.
- `revise_question` and `clarify_question` continue the normalization session.
- `import_question` accepts a market URL or publisher identifier and creates no run.
- `replace_question_file` returns a new ID while preserving the original snapshot.
  Use `wait_for_question_context` before forecasting; a failed file needs attention.
- `set_watch` enables paid reforecasts when the evidence changes; schedules use a timer.
- Share links grant anonymous access to anyone holding the token. Create them only
  when the user wants sharing; revoke them when that access should end.
- `accept_forecast_context` saves a chat suggestion with provenance; `rerunNow=true`
  also starts a paid forecast and requires `forecasts:write`.
- `set_question_subscription` follows or unfollows notifications for public questions.

- `normalize_question` — turn a rough request into a precisely specified
  question. Needs the `questions:write` scope; if the key lacks it, write
  the question yourself instead.
- `create_question` — save a question **without** starting a run. Use it
  when the user wants it on record first — to build up several before
  running any, or to tag and schedule it — rather than by default; most
  of the time go straight to `create_forecast`. Takes the same `question`
  object and optional `context` notes.
- `create_forecast` — start a run. Pass exactly one of `question` (an
  inline object) or `questionId` (an existing question). `context` is an
  optional list of notes, the same shape `add_question_note` takes,
  attached before the run starts. `runMode` picks how deep the run
  goes: `light`, `moderate`, `standard`, `deep` or `max`. Leave
  it out for the default mode.
- `list_run_modes` — the five run modes, lightest first, each with its
  rough time and its price in credits, and the default mode. A deeper mode
  costs more and takes longer.
- `get_forecast` — fetch the current envelope. **This is how you check on
  a run.**
- `wait_for_forecast` — watch the run for one short interval, 30 seconds by
  default, streaming progress while it waits. `timeoutSeconds` is
  clamped to [1, 55]; `pollIntervalSeconds` is clamped to [5, 30].
- `cancel_forecast` — abort a queued or running task. Idempotent.
- `list_questions` — the user's own questions, most recent first, each
  with its `tags`. Pass `tag=<slug>` to narrow to one tag. `limit` is
  clamped to [1, 200].
- `set_question_tags` — replace the labels on a question the user
  created. Tags are the user's filing system, never seen by the model, so
  this is safe at any time. Needs `questions:write`.
- `list_tags` — the user's tag vocabulary with a `questionCount` each;
  check it before inventing a new label.
- `list_forecasts` — the user's own forecast tasks, optionally filtered
  by `status` or by `questionId`. `limit` is clamped to [1, 200]. This
  lists the runs; it does not carry the numbers they produced.
- `list_forecast_results` — the forecasts themselves, across every
  question, with each one's estimate. Takes several `questionIds` or
  `taskIds` at once, so results for a list of questions come back in one
  call. `autoforecast="watch"`, `"schedule"` or `"any"` narrows to
  questions that re-forecast themselves. Each result's `report` holds only
  its `status` and the `short` text; `get_forecast` gives `medium` and
  `detailed`. `fields="numeric"` returns the estimate without the report
  and sources, which is much smaller.
- `create_forecast_batch` — start up to 25 forecasts in one call. Each
  entry in `items` is a whole `create_forecast` request. One bad entry is
  reported on its own and the rest still start, so read `counts` rather
  than assuming success. Pass an `idempotencyKey`: without one a retry
  starts every accepted item a second time. Nothing stores the batch: keep
  the task ids it returns. Needs `forecasts:write`.
- `cancel_many_forecasts` — stop several runs at once, by task id. A task
  that already finished is reported as such, not as a failure. Needs
  `forecasts:write`.
- `get_schedule` / `list_schedules` — read recurring forecast schedules.
  `list_schedules` takes an optional `status` of `active` or `ended`.
- `set_schedule` — re-forecast a question on a cadence. Replaces any
  existing schedule.
- `delete_schedule` — stop the cadence. Idempotent.
- `add_question_note` — attach something the user knows that the model
  would not find by searching. Applies to the **next** run, not to a
  forecast already generated. `treatment` is `consider`, `look_into`,
  `assume_true`, or `ignore`. Use `ignore` for a claim, source or
  assumption the user says is unreliable or not applicable: the model is told
  not to rely on it. Needs `questions:write`.
- `upload_question_file` — attach a document, base64-encoded, up to 10 MiB
  per document or image; up to 10 active files and 500 MiB total per question. Extraction runs in the background, so it comes back
  `processing` and is not yet part of any forecast. `artifactType` says
  what the file is — `user_context` (default), `background`,
  `evidence_source`, `dataset`, or `assumption` — and `treatment` how to
  use it, the same values as a note except `ignore`: a file cannot be
  ignored, so remove it instead.
- `update_question_file` — change a file's `artifactType`, `treatment`,
  `targetSubforecastIndex`, `userNote`, or `publicData` after upload.
  `publicData: true` shows a data file and its chart to everyone who can see
  the question; only the question's creator may set it. The bytes stay; use
  `replace_question_file` to replace them.
- `list_question_context` — the notes and files on a question. **Read a
  file's `status` here before `create_forecast`:** only `ready` counts.
- `remove_question_note` / `remove_question_file` — stop one being used by
  future runs. Idempotent; removing a `failed` file is how you unblock a
  question whose upload could not be parsed.
- `chat_with_forecast` — ask why the number is what it is, what would move
  it, or whether a factor was considered. Answers come from the stored
  reasoning behind that run, not a fresh guess. Costs a model call per
  message. **If the user only wants the number, the report or the sources,
  `get_forecast` already has them — do not spend a chat call on it.**
- `list_forecast_chats` — your existing conversations on one forecast, to
  find a `threadId` to continue.

## Connections

A connection is an MCP server that the user's forecasts can call. A
`personal` connection is used only for forecasts the user starts. An
`organization` connection is used for every member's forecasts and needs an
organization admin. Needs `connections:read` to look and `connections:write`
to change; both are separate from the forecast scopes.

Use `list_connections` and `get_connection` to look. Keys and sign-ins are
never returned; `hasApiKey` and `signedIn` say whether one is stored.
`create_connection` tests the server and lists its tools. Tools the server says
change data start switched off. `update_connection` takes `tools` in
`changes` to switch a tool on or off, and `enabled` to switch the whole
connection. A failed test still saves the connection with the status
`failing`; fix it with `update_connection` and `test_connection`. When presets switch a
connection off, `delete_connection` answers `in_use` with the number of
presets; call it again with `confirm=true` only if the user agrees.
`set_connection_member_switch` turns an organization connection off for the
user's own forecasts only.

For an `oauth` connection, call `start_connection_sign_in` and give the user
the `authorizationUrl` to open in a browser. Sign-in cannot finish without a
person. Check `get_connection` afterwards for `signedIn`.

A forecast that uses connections can send what the model asks, and show what
the server returns, to anyone who can read the question. `create_forecast` and
`create_forecast_batch` add a `warnings` entry to what they return when
that applies. Tell the user; the forecast has started anyway.

## Forecast presets

A forecast preset is a named set of standing notes, files and connections to
switch off. A forecast that uses it gets the notes and files next to the
question's own, and runs without the switched-off connections. Only the person
who ran the forecast sees a personal preset's name, notes and files, and
members of the organization see an organization preset's; everyone else sees
`preset: {"used": true}`. The forecast's own text may still reflect the notes
and files, so a request that starts a forecast, or stores a preset for reruns,
can answer with a `preset_content_may_show_in_forecast` warning. Needs
`forecasts:read` to look and `forecasts:write` to change.

`list_forecast_presets` and `get_forecast_preset` look. `create_forecast_preset`
takes `scope` (`personal`, or `organization` for organization admins) and
`name`. `update_forecast_preset` takes a `changes` object; `notes` and
`disabledConnectionIds` are the whole new list. Add files with
`upload_forecast_preset_file`: a file is used once its `status` is `ready`,
and a forecast that would use the preset waits for it (the `context_not_ready`
refusal) unless `allowIncompleteContext` is set.

To choose a preset for one forecast, pass `presetId` to `create_forecast`,
`create_forecast_batch` items or `start_decision_forecasts`: an id, or
`"none"` for no preset. Leave it out and the run uses the question's own
preset, then the user's default, then the organization's. `connections` is
`{"off": [...], "on": [...]}` and changes connections for that run only.
`prolepsiaRecords: false` keeps that one forecast from reading Prolepsia
records (earlier forecasts, other questions and how they resolved, market
prices, the track record). It is never saved on the question.
`set_schedule`, `set_watch` and `set_decision_live` store a `presetId` for
their reruns: leave it out to keep what is stored, `"none"` for no preset,
`"default"` for the defaults. Put `defaultPresetId` in `create_question`'s
`question` or in `update_question`'s `changes` to set a question's own preset.
`get_forecast_preset_defaults` and `set_forecast_preset_defaults` read and
set the user's and the organization's defaults.

`delete_forecast_preset` answers `in_use` with counts when something still
uses the preset. Call it again with `confirm=true` only if the user agrees;
those things then use the defaults. A forecast read shows the `preset` it used,
as far as the reader may know it.

## Question templates

A question template is a saved shape for a question: its fields with named
blanks written `{key}` (for example "Will {company} beat earnings in
{quarter}?"), starting notes and files, tags, drafting guidance for the AI and
a forecast preset. A question made from a template keeps its own copy of the
wording, notes and files, so changing or deleting the template never changes
it. Needs `questions:read` to look and `questions:write` to change.

`list_question_templates` and `get_question_template` look; each template lists
its `blanks`. To make a question from one, put `templateId` and
`templateValues` (a value for each blank, by key) in the `question` object
of `create_question` or `create_forecast`. `title` and `type` may then be left
out, and a field you send wins over the template's. When the user names the
subject in words, `fill_question_template` asks the AI for the blank values
from a short `prompt`; check them before you use them. The question also takes
the template's notes, files and tags, and its preset as the question's own
default preset. A template whose file is still being read refuses with a
message that names the file; try again in a moment.

`import_question` takes `templateId` too: the question keeps its imported
wording and adds the template's notes, files, tags and preset.
`normalize_question` follows the template's drafting guidance.
`create_decision` and `generate_decision_questions` make the drafts follow the
template, and `add_question_to_decision` with `templateId` and
`templateValues` makes a new question from it and puts it on the map. A
question you created shows its `sourceTemplate`.

`create_question_template` takes `scope` (`personal`, or `organization` for
organization admins), `name`, `questionType`, `fields` and `blanks`. Declare
every blank the text uses, and use every blank you declare.
`update_question_template` takes a `changes` object; `notes` is the whole new
list. `save_question_as_template` turns a question you can read into a template.
Add files with `upload_question_template_file`. `delete_question_template`
answers `in_use` with counts when questions or waiting decision drafts use the
template; call it again with `confirm=true` only if the user agrees.

## Webhooks and safe retries

Use `create_webhook` to register an HTTPS receiver owned by the user. The
signing secret is returned only on creation and rotation; store it securely.
Choose `eventKinds` from `forecast.started`, `forecast.completed`,
`forecast.failed`, `forecast.cancelled`, `forecast.report.completed`;
the default is completion only. `forecast.report.completed` arrives once
the written report is ready or has failed, a little after
`forecast.completed`.
`{"name":"update_webhook","arguments":{"webhookId":"<id>","changes":{"enabled":false}}}` pauses delivery, and true resumes it.
Events occurring while paused are not captured; previously queued deliveries wait.
URL changes cancel queued deliveries; requests already in flight may finish.
`test_webhook` sends a signed `webhook.test` event, even when paused.
Test and replay calls share a 20/minute per-user rate bucket across connections.

Read `list_webhook_deliveries`, `get_webhook_delivery`, and
`list_webhook_delivery_attempts` to investigate failures. Network failures,
408/425/429 and 5xx responses retry after 30s, 2m, 10m, 30m and 2h, then stop.
Other non-2xx responses fail permanently. Delivery is at least once: deduplicate
using `X-Prolepsia-Delivery-Id`. Retries and manual replays retain the same delivery
ID and payload. `replay_webhook_delivery` accepts only failed/cancelled deliveries
and an enabled endpoint; it uses the current URL and resets the retry budget.

For `create_forecast` **and `create_forecast_batch`**, generate an
`idempotencyKey` before submitting and reuse it with the identical payload if
the response is lost. It lasts 24 hours,
scoped to the API key (shared with REST) or the OAuth connection (survives token
refresh). Different bodies conflict. Without a key, resubmission starts a new
paid run — for a batch, that is every accepted item again, so a key matters
more there, not less. A retry aimed at the items that *failed* needs a new key,
because the body has changed. Incomplete files refuse a run with `context_not_ready`; use
`allowIncompleteContext=true` only when the user explicitly wants to proceed
without them. `get_question_file` reads one file; `list_question_forecasts`
returns completed forecast history with cursor pagination (limit 1–100).

## Standard workflow

Three points where you stop and involve the user: how the question gets
written, approving the question, and whether to watch the run. Never skip
the approval step — a forecast is a paid job that can run for over an
hour, answering exactly the question you sent, not the one the user meant.
Agree the run mode at the same step: if the user has not named one, say
which mode the run will use and what it costs (`list_run_modes`), and
let them pick another.

```
ask how to spec it -> draft/collect fields -> SHOW THE STRUCTURE
   -> user approves -> attach context (optional) -> create_forecast
   -> ask: watch or hand off?
   -> watch: check briefly, then poll every few min -> summarize
```

Default to `create_forecast` at that last step — that is what "forecast X"
means. Reach for `create_question` instead only when the user explicitly
wants the question saved without running it yet, then start it later with
`create_forecast({ questionId: ... })` whenever they are ready.

If the user has told you something the model could not find on its own —
a decision they have made, a document they hold, a reading of the
question they want enforced — attach it **before** starting the run:
notes can go straight into `create_forecast({ context: [...] })` in the same
call, or through `add_question_note` first; files always go through
`upload_question_file` first. Context attached afterwards applies only to
the next forecast. When you upload a file,
pick the `artifactType` that matches what the user handed you: a report
or filing is `evidence_source`, a spreadsheet is `dataset`, something they
want taken as given is `assumption` (pair it with
`treatment="assume_true"`), general reading is `background`. The default
`user_context` is right for anything they wrote themselves.

A file is not usable the moment it uploads. Poll `list_question_context`
until its `status` is `ready`; `create_forecast` is refused with
`context_not_ready` while anything is still processing, rather than
quietly running without it. A `failed` file never becomes ready — remove
it, or the question stays blocked.

### 1. Ask how the question should be written

Unless the user already gave you a complete spec, ask which they want:

> I can draft the full question spec myself (type, resolution criteria,
> bounds) and show it to you before anything runs — or you can give me the
> fields. Which do you prefer?

- **Drafted (the default if they do not care):** call
  `normalize_question({ title: ... })`. It web-searches for context and returns
  a complete, valid question. On `status: "unsupported"` show the user
  `suggestedReframe` and agree on something forecastable first. If it is
  refused for a missing `questions:write` scope, say so in one line and
  write the question yourself from the payload shapes below.
- **User-supplied:** take their fields, fill only what is structurally
  required, and flag every value you had to invent.

### 2. Show the question structure and get approval

Print the complete question **before** calling `create_forecast` — every
field that will be sent, including ones you or `normalize_question`
filled in. The user cannot approve what they cannot see, and the defaults
are exactly what changes a forecast without anyone noticing.

Render it like this, marking where each value came from:

```
Question to forecast
  Type              numeric                      (drafted)
  Title             US real GDP YoY growth, Q4 2027   (yours)
  Bounds            -5 to 10 percent             (drafted)
  Scale             linear                       (drafted, required)
  Open bounds       upper open, lower closed     (drafted)
  Description       Headline BEA figure...       (drafted)
  Resolution        Resolves to the first BEA advance estimate for Q4
                    2027, published Jan 2028, seasonally adjusted
                    annual rate, as printed in BEA release ...   (drafted)

This resolves off the BEA advance estimate, not a later revision.
Approve, or tell me what to change?
```

Rules for this step:

- **Never omit a field because you defaulted it.** `scaleType`,
  `openLowerBound` / `openUpperBound`, and
  `optionsAreMutuallyExclusive` / `optionsAreComprehensive` all change
  the answer and none of them is visible to the user otherwise.
- **Say where each value came from** — theirs, drafted by
  `normalize_question`, or invented by you. Invented values are the ones
  worth arguing about.
- **Call out the resolution criteria in a sentence of plain English.** It
  decides what the number means; everything else is packaging.
- Offer the raw JSON if they want it, but lead with the readable form.
- Wait for approval. Apply any edits and show the structure again.

### 3. Create, then ask how to follow it

`create_forecast` with the approved question (or a `questionId`). The
response is a `forecast_task` envelope with `status: queued`. Report the
`taskId` and the expected wait immediately, then ask:

> Started — task `<id>` in <mode> mode, about <time>. Want me to watch it
> and report progress every few minutes, or hand you the id and stop?

Take the time from the mode's `timeHint` in `list_run_modes`.

Default to watching if they do not say. See "Watching a run" below.

### 4. Summarize

On `completed`, the interesting fields live under `forecast`:

- `forecast.forecastData` — the probability (binary) or distribution
  (numeric / discrete / date / multiple-choice).
- `forecast.report` — the written report, with `short`, `medium` and
  `detailed` texts. It is written after the forecast, so its `status` may
  still be `pending` or `writing`, and the texts are null until it is
  `completed`. Give the length the user asks for, `medium` by default. If
  it is not ready, give the number now and fetch the report later with
  `get_forecast`. A forecast saved before reports existed has a
  `completed` report whose `short` and `medium` are null; give
  `detailed` then. `report` is null for a forecast that has no report.
- `forecast.sources` — citations the forecast is grounded in.

Restate the resolution criteria alongside the number, so the user reads
the forecast against the question that was actually asked.

`partial: false` confirms this response is the combined answer and not work
in progress. See "Reading a run before it finishes" for what to do with a run
that is not there yet.

On `failed` or `cancelled`, say so and offer to re-run. Those are the two
statuses that mean the forecast did not happen — though their finished
subforecasts are still readable, which is often enough to tell the user what
the run had found before it stopped.

## Watching a run

Watch mode uses short bounded checks. One tick is one 30-second call:

```
wait_for_forecast({ taskId: "..." })
```

While it waits it streams progress notifications carrying the live status,
so the user sees movement rather than silence. Each call
then returns either the terminal envelope (done — go summarize) or a
result carrying `waitTimedOut: true`, the live `status`, and
`progressMessage`.

Every envelope also carries `completedSubforecastCount`,
`plannedSubforecastCount` and a `subforecasts` list, so each tick has a
concrete number to report:

> [12 min] Still running — synthesizing. 4 of 5 subforecasts complete.

If the client can remain active, wait a few minutes before checking again.
Otherwise hand off the task id and let the user resume in a later chat.

- **A tick that comes back `waitTimedOut` is normal**, not a failure,
  and not a reason to re-create or cancel anything.
- **If a tick fails at the transport level** (connection reset, client
  timeout, gateway error), that is also not a failure. Call
  `get_forecast(taskId)` to find out where the run actually is, then
  carry on.
- **Do not raise `timeoutSeconds` above the default** hoping to wait the
  whole run out. The ceiling is 55s, and a longer tick means longer
  between updates for the user.
- **Do not tighten the cadence.** A subforecast takes minutes, so the
  counts rarely move between adjacent ticks, and each call costs against
  the per-connection rate limit.
- **Stop watching** when the user says so, or when the session is ending.
  Then hand off: give them the `taskId` and tell them they can ask you
  later ("is forecast `<id>` done?") or open the Prolepsia web app. The run
  continues server-side regardless.

If the user chose hand-off instead of watching, do that immediately after
step 3 and do not poll at all.

### Reading a run before it finishes

A Prolepsia forecast is made of several separate forecasts, called
subforecasts, that run at the same time. A final step then combines them
into the answer. Subforecasts finish one at a time, and you can read each
one as soon as it does, on both `get_forecast` and `wait_for_forecast`.

Pass `includeSubforecasts=true` to get each finished subforecast's
`forecastData`, `writeUp` and `sources` as well as the counts. Use it when
the user asks what the forecast is finding so far, or wants to see the
reasoning behind a run that failed part-way through.

Two rules make this safe to use:

- **`partial: true` means this is not the answer.** It is set on every
  response with no combined `forecast` — a run still going, and also one
  that failed or was cancelled before its subforecasts were combined.
  Subforecasts disagree with each other on purpose, and the final step is
  what settles the answer. Never give the user a subforecast's number as
  the forecast. Say what it is: one of several estimates, still in progress.
- **The response is much larger, and how much varies a lot.** One
  subforecast's sources can be a few KB or several hundred, so asking for
  content on a five-subforecast run can return well over 1 MB. Ask for it
  when the user wants the content, not on every poll while waiting.

### Answering questions about a finished forecast

Once a run completes, the user will often want to interrogate it rather than
read it. `chat_with_forecast({ taskId: ..., message: ... })` answers from that
run's own reasoning. Pass the returned `threadId` back on follow-ups so the
conversation keeps its context; the last `assistant` message is the answer.

Two things worth saying out loud to the user: each message is billed, and the
answer is grounded in what that forecast actually considered — so "was X
taken into account" gets a real answer rather than a plausible one. If a
reply comes back with a `rerunSuggestion`, the model is proposing new
context for a future run; relay it and let the user decide.

### Picking up work from an earlier session

`list_forecasts({ status: "queued" })`, `"running_subforecasts"`, or
`"synthesizing"` surfaces runs still in flight — that is how you find a
forecast started before this conversation. `list_questions()` returns
`id`, `type`, `title`, `createdAt`; pick an `id` and call
`create_forecast({ questionId: ... })` to re-run it or
`list_forecasts({ questionId: ... })` to see prior runs. Reach for these
whenever the user asks "what have I forecasted" / "show me recent
forecasts", rather than telling them to visit the web UI. When they ask
about a group of questions by label — "my energy questions", "everything
tagged Q4" — call `list_tags()` to find the slug, then
`list_questions({ tag: ... })`.

Three list tools cover forecasts and it is worth keeping them apart:
`list_forecasts` gives the runs and their status, `list_forecast_results`
gives the results across every question, and `list_question_forecasts`
gives the results for one question. When the user wants numbers rather
than a status board, reach for one of the last two.

List responses are compact summaries. A result's `report` there holds
only `status` and `short`, and `short` is null for a forecast saved
before reports existed. Call `get_forecast` for the full envelope,
including the `medium` and `detailed` report, the distribution and the
sources.

### Several forecasts at once

When the user hands over a list of questions to screen, use
`create_forecast_batch({ items: [...] })` rather than calling `create_forecast`
once per question. Every item is a paid run, so confirm the list with them
first. The response gives a task id per accepted item and an error per
refused one; poll the accepted ones together with
`list_forecast_results({ taskIds: [...], fields: "numeric" })`, and stop what
they no longer want with `cancel_many_forecasts({ taskIds: [...] })`.

### Whose work the lists return

The three list tools default to **the user's own** work — questions they
created, runs on those questions, schedules they set up. That is what
"my questions" means and it matches what they see in the Prolepsia web app.

Pass `all=true` only when the user asks about more than their own work.
On an operator/admin connection that widens to **every** question, task, or
schedule in the whole Prolepsia instance, which is almost never what
someone means by "what have I forecasted". Each list response carries a
`scope` of `created_by_me` or `all_visible` — say which one you reported
if you used `all=true`.

## Decisions

A decision is a choice between 2 to 4 options, with a map of questions that
bear on it. Use these tools when the user is weighing a choice, rather than
asking about one future event.

- `create_decision` takes a `title`, the `context`, a `decideBy` date
  (`YYYY-MM-DD`) and `options`, a list of `{"label": "...", "description":
  "..."}`. Show the user the options before you send them, and pass an
  `idempotencyKey`. It returns at once and queues a first round of question
  drafts.
- `get_decision` is how you follow everything. `generation.status` is
  `queued`, `running`, `succeeded` or `failed`; a round takes a minute or two,
  so poll every ten seconds or so, not in a tight loop. `drafts` holds the
  question drafts waiting for review. `nodes` holds the questions on the map,
  each with its `latestForecast` and any `activeForecastTasks`.
- `review_decision_drafts` keeps or discards drafts by id. Show the user the
  draft titles and let them choose. A kept draft becomes a real question within
  a minute or two. A draft whose status is `needs_attention` carries the reason
  in `attention`; discard it, or edit it through the REST route
  `PATCH /decisions/{decisionId}/drafts/{draftId}` and keep it again.
- `generate_decision_questions` asks for more drafts (`kind="more"`) or for
  drafts that dig into one question (`kind="expand"` with `sourceNodeId`).
  One round runs at a time. On a decision shared with the organization, a
  question colleagues cannot read cannot be expanded (`question_not_shared`).
- `add_question_to_decision` puts an existing question on the map.
  `remove_question_from_decision` takes a node off it and needs the node id,
  not the question id. The question and its forecasts stay.
- `link_decision_questions` joins two nodes. `type="context"` feeds the
  source's latest forecast into the target's next forecast, so the user can
  chain questions. `get_decision` lists `links`, and each context link says in
  `context` whether the source forecast is passed on and, if not, why (a
  more private question, a forecast that read uploaded files, no forecast yet).
  `type="conditional"` asks the target question again on a `condition` about
  the source, or on `preset="source_yes"` or `"source_no"` for a yes/no source.
  It answers at once with status `drafting`; a job writes the conditional
  question, so poll `get_decision` until the link is `active` (the new question
  is a node with role `conditional`) or `failed` (`error` says why).
  `edit_decision_link` changes a failed link's condition and tries again.
  `remove_decision_link` removes a link and keeps both questions.
- `add_decision_note` adds a note to the whole decision. It steers every
  forecast on the map: it is copied among the notes of each question the user
  created there, with the same `type` (`consider`, `look_into`,
  `assume_true` or `ignore`). Questions other people created get no copy;
  `get_decision` shows `receivesDecisionNotes` on each node. A copy cannot be
  edited or removed on the question while the decision is active, so use
  `edit_decision_note` and `remove_decision_note` with the note id from
  `get_decision`. Each change adds a version to the questions it reaches.
- `update_decision` takes a `changes` object. A list of `options` replaces the
  active options, so send the `id` of each option you keep. `archive_decision`
  makes the map read-only, and `archived=false` reverses it. Only the author
  may change a decision.
- Sharing: `update_decision` with `changes={"visibility": "organization"}`
  shares the decision with the other members of the user's organization, and
  `"private"` takes it back. Ask the user first, and show them the questions
  that would stay private: `get_decision` lists them as
  `sharing.privateQuestionIds`, and `shareQuestionIds` shares some of them
  too. A reader sees a question they cannot read only as an entry in
  `hiddenNodes`, with no title, forecast, links or comments, and reads the
  team summary, which leaves those questions out.
- `list_decision_comments` and `add_decision_comment` are the team's
  discussion. Members of the organization can comment on a shared decision, on
  a node, a link or the whole decision, with one level of replies. Comments
  never reach a forecast or a summary: to steer a forecast, use a decision
  note.

Forecasts on a decision cost credits and take 5-90 minutes each, depending on
the run mode. Always call
`estimate_decision_forecasts` first and show the user the quote: the price per
forecast, the questions it covers (`selected_node_ids`), the total, what
their own balance pays (`own_total_credits`), their balance
(`balance_state` is `known`, `hidden` or `unlimited`) and each
question in `cannot_start` with its reason. Get approval. Then call
`start_decision_forecasts` with `maxTotalCredits` set to the approved total,
`expectedPricePerForecast` set to the quoted `price_per_forecast`, the
same `runMode` and an `idempotencyKey`. Without `nodeIds` every
startable question runs again, finished forecasts included. To retry only what
did not run, pass the estimate's `unfinished_node_ids` as `nodeIds`. A conflict named `price_changed` means the price per
forecast is no longer the quoted one and nothing started: estimate again and
show the user the new quote. If the price moves while a batch is starting, the
forecasts already started stay and the rest come back `not_started` with the
reason `price_changed`. Each
node answers on its own: `status` is `started`, `already_running` or
`not_started`, and a node that did not start has a `reason`. The reason
`active_forecast_limit` means too many of your forecasts are already running:
wait for some to finish, then start the rest again. A conflict named
`price_above_ceiling` means the price rose above the ceiling and nothing
started; estimate again and ask the user. Forecasts started this way send no
per-forecast email. The author gets one email when the batch has finished.

`get_decision_summary` returns the newest summary, which weighs each option
against the forecasts. Its text names options and questions by keys such as
`o1` and `n1`, and `summary.keys` maps each key to its option or node. The text
carries no figures: read the numbers from each node's `latestForecast`.
`summary.freshness.state` says whether the summary still matches the current
forecasts: `current`, `new_evidence` (see `changes`, each with its old and new
value), `updating` or `update_failed`. `summary.coverage` counts the questions
the summary could use and those that were missing, running, failed or
cancelled. A newest run with `errorCode` `no_completed_forecasts` ended without
a summary because no forecast had finished.
`refresh_decision_summary` writes a new one from the latest forecasts and takes
a minute or two. Creating a decision, keeping drafts, drafting more questions,
linking questions conditionally and refreshing the summary share a limit of 10 requests a minute.

`set_decision_live` turns live mode on or off for a decision the user made. Live
mode watches each question on the map, reruns the questions that depend on a
forecast that moved, and emails the user when the summary shifts. It costs
credits, so ask first: call `estimate_decision_live` with `runMode` and
`monthlyCapCredits`, the most the automatic reruns may cost in a calendar
month. It charges only the questions live mode would pay a watcher month for
now (`watcher_fee_total`); every other question is in `free_nodes` with the
reason it costs nothing now. It also gives the watcher fees for a month
(`monthly_fee_total_credits`, outside the cap), the cap, and their sum
`most_per_month_credits`, the most live mode can spend in a month. Show the
user that sum, then send `set_decision_live` with `maxFeeCredits` set to
`watcher_fee_total` and an `idempotencyKey`. Higher fees due now answer a
conflict named `price_changed` and change nothing. The answer lists
what happened to each question's watcher (`turned_on`, `already_on`,
`not_allowed`, `resolved`, `insufficient_credits` or `price_changed`, which
means the monthly fee or the question count changed after the quote and that
question was left off; quote again). The answer's `stopped`, when live mode
goes off, says which questions stopped and which keep running because another
live decision or their owner holds them; months already paid are not refunded.
A question added to a live decision is never shown as kept up to date without a
watcher: send `add_question_to_decision` with `includeInLiveMode` true and
`maxFeeCredits` set to the `watcher_fee_total` of `estimate_decision_live`
with that `questionId`, or false to leave it out. Left out of the request, it
is added and not kept up to date, and the answer's `monitoring` says so.
`set_decision_node_monitoring` includes or leaves out one question later, by
node id. Each node in `get_decision` has `monitoring` (`on`, `paused`,
`excluded` or `unavailable`, the time of its newest forecast and, for the
author, the reason). `live.monitoring.continuation` is set when the decision
has moved on with live mode still on (the deadline passed, a choice was recorded
with no review, or a review was completed with no next review): ask the user
whether to keep live mode on, then send `answer_decision_live_continuation`.
`save_decision_choice` and a completed review take `keepMonitoring` for the
same answer.
`get_decision` lists the checks still open in `comparison.open_checks`: a hard
limit with no confirmed state and a fact not verified. Forecasts finishing does
not close them, and `state.progress` stays `researching` until they are
settled. Recording an option that has an open check is refused unless the author
said they accept it: send `acceptOpenChecks` true only then. The open checks and
the acceptance are kept in the recorded choice.
`get_decision` shows `live` (on or off, and for the author the cap and this
month's spend; `live.cap.reached` means reruns are paused until next month or
until the cap is raised) and `follow`. `set_decision_follow` follows or
unfollows a decision shared with the user's organization, for an email when its
summary shifts. The author always gets those emails and cannot follow.

A condition is a statement about the world that Prolepsia checks against the web
while live mode is on, for example "The Bank of England cuts Bank Rate
at a meeting before 1 March 2027". When an armed condition is found met, the questions on
the nodes it names are forecast again, and the author and followers are emailed.
Each of those forecasts costs credits and counts toward the monthly cap.
`list_decision_conditions` shows each condition with its
`state` (`armed` or `met`), its `nodeIds`, and its newest checks (`met`,
`not_met`, `unclear` or `error`, with the explanation and the sources).
`checking` is false while live mode is off: conditions then wait and nothing is
checked. `save_decision_condition` is author only. Send `text` and `nodeIds`
(node ids from `get_decision`, not question ids) to add one, and a decision holds
at most 10. The checker sees only the decision's title and the condition text, so
write the text to stand on its own and name the people, places, dates and
thresholds. `intervalHours` is 6 to 720 and defaults to 24. Send the
`conditionId` with the fields to change, or with `delete` true to remove it,
and nothing else then. A met condition does nothing more until you send its
`conditionId` with `armed` true; offer that when the user wants the condition
to act again.

Criteria are what the user wants from a decision: goals, hard constraints (a
rule an option must meet) and preferences, which may carry a weight from 1 to
5. They are the user's own values. Never invent a criterion, a weight or a
threshold for the user; ask, or propose it and say it is a proposal.
`list_decision_criteria` shows each with `origin`, `confirmed` and a
`lineageId` that stays the same when the criterion is corrected (an item's
`criterionIds` hold it); a model's
proposal stays unconfirmed until the author sends its `criterionId` with
`confirmed` true. `save_decision_criterion` is author only. Send `kind` and
`text` to add one (a decision holds at most 20), the `criterionId` with the
fields to change (the answer holds a new `criterionId`, because a change adds
a new version), `delete` true to remove it, or `criterionIds` alone to put
them in order. A hard constraint a number can test takes a `measure` with
`direction` (`at_least` or `at_most`), `threshold` and the unit fields.

Items are the facts to check, actions to do and assumptions to confirm that are
not forecasts. `list_decision_items` shows each with its `kind`, `status` and
the fields of its kind. `save_decision_item` is author only. Send `kind` and
`text` to add one (at most 100), the `itemId` with fields to change, with
`kind` alone to correct its kind, or with `status` to move it on. A fact is
`verified` only with a source (`sourceUrl` or `sourceNote`), an action is
`done` only with a `completionNote`, and only the user decides that a fact is
verified, an action done or an assumption accepted. Your connection acts as the
user, so a status you set counts as their decision: set one only when they told
you to. Reuse `idempotencyKey`
to retry an add.

A model proposes items too. They carry `origin` model and `confirmed` false
until the author keeps them with `itemId` and `confirmed` true, or edits
them. A proposed fact may name a `sourceUrl` only when the model's own search
cited that page; treat it as a lead, not as verification. Each draft carries
`kind` forecast. A draft that asks whether a planned action will be done has
`aboutAction` true and should link an action item with an owner:
`actionWarning` says when it does not. `convert_decision_work` turns a draft
into an item (`direction="draft_to_item"` with `kind`) or an item nobody has
worked on into a draft (`direction="item_to_draft"`). For a map that already
has questions, `check_decision_questions` asks the model which ones look like a
fact, an action or an assumption and stores a flag with a reason for each
(`questionFlags` in `get_decision`); it changes no question.
`review_question_flag` dismisses a flag or, with `action="convert"`, adds the
matching item and keeps the question. Getting advice, what the advice says and
how long an action takes are different things: never treat a forecast about
whether the user will obtain advice as evidence about the advice itself.

A hard constraint may name the numeric question it is read against: put the
question's `nodeId` in the `measure` (its unit must equal the measure's). The
comparison then shows the chance that the newest forecast meets the threshold.
That chance informs the user; it never sets the state of the constraint.

`get_decision_comparison` shows how the options stand against the criteria. It
ranks nothing and names no leading option. For each option and criterion the
state is `satisfied`, `violated` or `unknown` for a hard constraint, and
`supports`, `conflicts`, `neutral` or `unknown` for a goal or a preference;
no entry means unknown. A state a model proposed has `confirmed` false and never
counts, for a violated constraint or anything else, until the author confirms
it. `save_decision_assessment` is author only: `action="set"` records a state
(with `nodeIds`, `itemIds` and a `note` for the evidence), `"confirm"` accepts
a proposal as it stands and `"clear"` resets the cell to unknown. Your connection
acts as the author, so set or confirm a state only when the user told you to.
`save_decision_payoff_model` is author only: `action="save"` replaces the
payoffs, `"remove"` deletes them. The payoffs, the unit and the loss limit are
the user's own values: never invent a money amount, an acceptable loss or a
ranking rule. Give one scenario question (yes or no, or multiple choice),
`unit` with a `valueFormat`, and `payoffs` as option id, then outcome, then a
number. The `sensitivity` part of the comparison works those payoffs out against
the newest forecast and shows where the preferred option changes. It is a
what-if on the user's numbers, not a forecast and not a recommendation. Do not
say that choosing an option causes an outcome.

`get_decision_review_updates` lists the changes in the evidence that call for a
review of the recorded choice: a confirmed rule on a measured hard constraint
crossed, a confirmed state of the chosen option changed, a fact the choice relied
on disputed, or an assumption it relied on rejected. Each change is measured
against the choice or its last completed review, so small changes add up, and
has the old and new evidence, why it matters and the review it made due
(`dueReason` on the review). A change in the model's reading alone is not one.
`incomplete` lists refreshes that failed or did not finish: say so and claim
nothing from that update. `evidenceHidden` means the user may not read the
question behind a change; do not guess at it. The product asks for a review and
never changes the choice, so do not complete a review or record a new choice
unless the user told you to. `save_decision_review_trigger` is author only:
`action="set"` confirms a rule for one hard constraint that has a measure
linked to a question (`kind` `breach_chance_above` or
`breach_chance_rise`, with `limitPercent`), `"remove"` deletes it. The limit is
the user's own: ask for it.

`get_decision_ownership` says who owns a decision, whether the user may hand it
over (`transferAs` is `owner`, or `admin` while the author is suspended or has
left) and, then, the active members it can go to (`candidates`). For a new
owner, `notice` says who handed it over, what moved and what stayed, and lists
each question as `can_rerun`, `read_only` or `hidden`. A hidden question has no
title: do not guess at it. `transfer_decision` hands a decision shared with the
organization to one candidate. Ask the user first and name the person: after the
hand-over the user can only read and follow it. Questions keep their authors and
the new owner gains no access to a question or file they could not read, so some
questions may need another person. Model suggestions nobody kept are set aside.
Reuse `idempotencyKey` to retry. `acknowledge_decision_handover` dismisses the
notice for the new owner.

`get_decision_brief` reads one dated brief as a document: the decision, options,
criteria, the model's reading and its limits, the evidence with dates and units,
the recorded choice and its review, the version and the date. It is built from
the stored summary, so it never changes after it is written; the criteria of an
older summary and the choice are today's and are labelled. `get_decision_evidence`
reads the question (`kind="question"`, `id` is its map node id) or item
(`kind="item"`) behind a claim: its full text, the forecast the brief used with
its unit and sources, the current forecast when it differs, and the limits. Say
what a limit says rather than hiding it. `audience="organization"` previews what
colleagues see. A question, item or brief the user may not read answers as not
found; do not guess at one.

`list_decision_choices` shows what the author chose, why, who is responsible,
what was known at the time and when to look again. Only the author records a
choice, and the brief's leaning toward an option never becomes one by itself:
record a choice only when the user told you what it is, with their reason and
who is responsible. `save_decision_choice` with `action="record"` takes a
`kind` of `option` (with `optionId`), `wait`, `decline_all` or
`gather_evidence`, a `rationale`, and `responsibleUserId` or
`responsibleName`. A wait needs a `review` with a `dueDate` or a
`conditionText`. `actions` adds next actions. A thin or out-of-date brief does
not block a choice: the choice stores how fresh the brief was. A recorded choice
is never edited. `action="reopen"` takes it back with a `reason`, and a changed
choice is a new record that replaces the old one. A review condition is checked
against the web only while live mode is on for the decision.
`save_decision_review` schedules, completes, annotates or cancels a review.
Completing one records `keep`, `change` or `defer` and why. Keeping the
original choice is a complete, successful review. `save_decision_next_action`
adds an action that follows the choice (`optionIds` and `criterionIds` name what
it settles), or marks one done (a note is needed) and can add the fact it
supplied. `set_decision_reminder_emails` switches the
reminder emails for the user.

`list_decisions_needing_attention` lists the user's active decisions that need
a look, most urgent first: an overdue review or next action, a passed deadline,
a deadline within seven days, blocked research (or live mode held by its cap),
then a summary to read. Ties go to the earlier decide-by date, then the later
change. Each item has `reasons` (`reason`, `key`, `why`) and one `action`;
nothing is scored by a model. A colleague reading someone else's decision gets
fewer reasons: a summary to read, and a review or next action only when they are
named on it. `timeZone` sets which day is today. To put reasons away, pass
entries copied from `reasons` to `dismiss_decision_attention`; a reason stays
away until it returns with a new key. `via="opened"` marks a summary as read.
Dismissing is the user's own and hides nothing from anyone else.

A decision can start from a saved conversation instead of `create_decision`.
`start_decision_intake_session` opens one (it asks no model),
`reply_decision_intake_session` asks the model to answer the last message and
updates the draft beside it (goal, options, decide-by date, hard constraints,
goals and preferences, what is missing), and
`prepare_decision_intake_session` writes the decisions into the session.
Every write sends the `version` just read; an older one answers
`intake_session_stale` and saves nothing, so read the session again. What the
user set stays: the model never rewrites an edited goal or option list. A date
the model writes has `origin` `suggested` and a proposed constraint has
`confirmed` false. Both are the model's, not the user's: show them, and
confirm one with `save_decision_intake_session` only when the user agrees.
`create_decisions_from_intake_session` refuses a date that is still suggested,
leaves out unconfirmed constraints and creates the decisions once; a repeat
returns the same ones. A session is private to its user and is deleted 30 days
after its last change.

`get_decision_research_plan` ranks what a decision waits on: forecast
questions beside facts to check, actions and assumptions. Each entry says what
it informs and what result could change the choice. Entries that share an
assumption or a source are flagged, and their results are not independent
evidence. The plan may say no more forecasts are needed. Put entries aside with
`defer_decision_plan_entries`, drop them with
`remove_decision_plan_entries`, then `approve_decision_research_plan` with
every waiting entry id and the quoted price per forecast. Approving keeps the
entries, starts no forecast and charges nothing; `start_decision_forecasts`
starts them with its own price check. Only the author sees the waiting entries.

Conflicts on decisions arrive as `invalid_request` with the conflict name first
in the message, for example `generation_in_progress`, `summary_in_progress`,
`question_already_on_decision`, `link_already_exists`, `link_would_loop`,
`conditional_links_busy`, `draft_not_reviewable`, `live_mode_disabled`,
`author_always_follows`, `decision_not_shared`, `work_in_progress`,
`too_many_conditions`, `too_many_criteria`,
`too_many_items`, `item_has_progress`, `flag_not_open`, `question_not_shared`, `record_changed` or `decision_archived`.
Wait or change the request; do not retry the same call in a loop.

## Tags

Tags are short free-text labels the user attaches to questions to keep
them organized — "energy", "Q4 planning", a client name. They are
**organizational metadata only**: never sent to the forecasting model,
never part of the question's content, and no effect on any forecast. That
is why retagging is allowed at any time, including after a run.

- Only tag when the user asks, or when they already keep a vocabulary and
  a new question plainly belongs in it. Do not invent a taxonomy for them.
- Reuse before inventing: `list_tags()` returns what they already use.
  Matching is case-insensitive, so `Energy` and `energy` are one tag.
- On a new question, put the labels in the `question` object passed to
  `create_forecast`: `{"type": "binary", "title": "...", "tags": ["energy"]}`.
  On an existing one, `set_question_tags({ questionId: ..., tags: [...] })`.
- `set_question_tags` **replaces** the whole set. To add one, send the
  current tags plus the new one; send `[]` to clear them.
- Up to 20 tags per question, 80 characters each. Only the question's
  creator can change them, and only the creator and their organization
  colleagues (on shared questions) can see them.

## Recurring forecasts

When the user wants a question tracked over time rather than answered
once, put it on a schedule instead of re-running `create_forecast`
yourself:

```
set_schedule({ questionId: "...", intervalCount: 1, intervalUnit: "days",
               endAt: "2027-01-31T00:00:00Z" })
```

- `intervalUnit` is `hours`, `days`, or `months`; timestamps are
  ISO-8601 and `startAt` defaults to now.
- **The cadence may not be faster than every 3 hours, and the window may
  not exceed 50 runs in total.** Both are rejected with
  `invalid_request`. Each run is a full forecast that costs
  real money, so pick the widest interval the user actually needs — daily
  is right for most questions, hourly almost never is.
- Calling `set_schedule` again replaces the schedule and restarts the
  cadence. `endAt` is required; there are no open-ended schedules.
- `get_schedule` returns `nextDueAt` and `occurrenceCount` (how many
  runs the window produces in total) — quote both back to the user before
  they commit to a cadence.
- `list_schedules()` answers "what am I forecasting on a schedule?" in
  one call. Each entry carries `questionTitle`.
- Scheduled runs appear in `list_forecasts` like any other task.
- `delete_schedule` stops future runs and leaves a run already in flight
  alone; use `cancel_forecast` for that.

## Forecast task statuses

<!-- prolepsia:statuses:start -->
```text
queued
running_subforecasts
synthesizing
completed
failed
cancelled
```
<!-- prolepsia:statuses:end -->

They advance in that order. These three are terminal — nothing changes
after them:

<!-- prolepsia:terminal-statuses:start -->
```text
completed
failed
cancelled
```
<!-- prolepsia:terminal-statuses:end -->

Any other status means the run is still going. You do not need to do
anything, and you can still see progress: every response reports how many
subforecasts have finished, and `includeSubforecasts=true` returns them.

## Passing `question` as an object

`question` is a structured argument, so pass a real JSON object in the
tool call. A JSON-encoded string is accepted too — the server parses it,
because some MCP clients serialize nested objects before sending — but
the object form is faster and clearer, so prefer it.

Preferred:

```json
{"question": {"type": "binary", "title": "...", "resolutionCriteria": "..."}}
```

## Question payload shapes

There are five question types. Every example below is complete and valid
as written; the constraints noted with each are enforced by the server,
and violating them returns `invalid_request` with the offending field.

These are also the fields to show the user for approval — including the
ones you defaulted. A field the user never saw is a field they never
agreed to.

Fields available on every type: `type`, `title` (required, <= 500
chars), `description`, `resolutionCriteria`, `finePrint`.

<!-- prolepsia:question-examples:start -->

### Binary (yes / no)

Must not carry options or bounds.

```json
{
  "type": "binary",
  "title": "Will the Fed cut rates at the December 2026 meeting?",
  "description": "Standard FOMC decision.",
  "resolutionCriteria": "The FOMC statement published on 2026-12-17 indicates a cut in the federal funds target rate."
}
```

### Numeric (a continuous quantity)

Requires `lowerBound`, `upperBound` (upper strictly greater), **and
`scaleType`** — one of `linear` or `logarithmic`. `scaleType` is not
optional; omitting it is rejected. `logarithmic` requires both bounds to
be positive. Set `openLowerBound` / `openUpperBound` to `true` when
the true value could fall outside the range.

State the unit when you know it, so a reader can tell a fraction from a
percent and dollars from barrels: `valueFormat` (`plain`,
`currency`, `percent` or `fraction`), `unitLabel` (for example
"barrels per day"), `currencyCode` (an ISO 4217 code such as `USD`,
required for `currency` and refused otherwise) and `period` (for
example "per month"). `percent` means percentage points (3.5 is 3.5%).
`fraction` means parts of one (0.10 is 10%). Leave a unit field out
when you do not know it. Do not guess. Once a forecast exists, the four
unit fields lock together: a unit can be set once, only while all four are
empty. Discrete
questions take the same fields. Other types refuse them.

```json
{
  "type": "numeric",
  "title": "Q4 2026 NVIDIA data-center revenue in USD billions",
  "description": "Reported in the Q4 2026 earnings release.",
  "resolutionCriteria": "NVIDIA's official Q4 2026 earnings press release, data-center segment line.",
  "lowerBound": 0,
  "upperBound": 100,
  "scaleType": "linear",
  "openUpperBound": true,
  "valueFormat": "currency",
  "currencyCode": "USD",
  "unitLabel": "billion",
  "period": "in Q4 2026"
}
```

### Discrete (a countable quantity)

Requires **integer** `lowerBound` and `upperBound`, spanning at least
two outcomes and at most 500 apart. Use `numeric` for wider ranges.
Does not use `scaleType`.

```json
{
  "type": "discrete",
  "title": "How many Starship orbital launches will SpaceX conduct in 2027?",
  "description": "Counted across all Starship vehicles.",
  "resolutionCriteria": "Launches from 2027-01-01 to 2027-12-31 UTC that SpaceX's official launch log records as reaching orbital velocity. Suborbital test flights and scrubs do not count.",
  "lowerBound": 0,
  "upperBound": 60
}
```

### Date (when something happens)

Bounds are **integer Unix timestamps in seconds**, not ISO dates. Must
not carry `scaleType` or `options`.

```json
{
  "type": "date",
  "title": "When will the first crewed Artemis lunar landing occur?",
  "description": "Artemis III or any later crewed landing, whichever comes first.",
  "resolutionCriteria": "The UTC date on which a crewed vehicle under NASA's Artemis program touches down on the lunar surface, per NASA's own announcement.",
  "lowerBound": 1767225600,
  "upperBound": 2019686400
}
```

`1767225600` is 2026-01-01 and `2019686400` is 2034-01-01, both UTC.

### Multiple choice

Requires 2 to 200 `options`, all unique.
`optionsAreMutuallyExclusive` and `optionsAreComprehensive` both
default to `true`; set one to `false` when the options can overlap or do
not cover every outcome.

```json
{
  "type": "multiple_choice",
  "title": "Which candidate will be inaugurated as US president on 2029-01-20?",
  "description": "Standard inauguration outcome.",
  "resolutionCriteria": "The person who takes the oath of office on 2029-01-20.",
  "options": ["Candidate A", "Candidate B", "Other"],
  "optionsAreMutuallyExclusive": true,
  "optionsAreComprehensive": true
}
```

### Long-horizon (5-10 years out)

Not a separate type — any type, written with extra care. The state of the
world that decides the outcome must stay unambiguous even if the
underlying technology, markets, or institutions shift in the intervening
years. Anchor on something measurable that will plausibly still exist at
resolution time (a public benchmark, regulatory filing, named index).

```json
{
  "type": "binary",
  "title": "Will a commercially available battery cell exceed 1000 Wh/kg specific energy by the end of 2035?",
  "description": "Long-horizon technology forecast. 1000 Wh/kg is roughly 3x current best-in-class lithium-ion (~300 Wh/kg in 2026).",
  "resolutionCriteria": "By 2035-12-31 23:59 UTC, at least one rechargeable battery cell is listed in a published datasheet from a battery manufacturer with >= 100M USD annual revenue, sold to industrial / EV / aviation customers (not lab samples), with specific energy >= 1000 Wh/kg as measured at the cell level under standard test conditions (25C, 0.5C discharge to 80% depth of discharge). Resolves YES if such a product exists and is shipping in volume. NO otherwise. Edge cases: solid-state, Li-S, Li-air all count if they meet the threshold; lab-bench prototypes and concept demos do not."
}
```

<!-- prolepsia:question-examples:end -->

## Question framing tips

Prefer `normalize_question` — it applies all of this and web-searches for
context. Either way the user approves the result before anything runs.
When you write a question by hand:

- **Resolution criteria is the most important field.** A precise,
  falsifiable rule determines forecast quality; vague criteria produce
  vague forecasts.
- **Pin the time horizon** — either in the title or the resolution
  criteria. "Soon" is not a horizon.
- **Lock in interpretation.** If a question is ambiguous, pick a
  reading and encode it in the resolution criteria; do not leave it
  to the engine.
- **Atomic questions.** Decompose compound ones ("Will X happen AND Y
  happen?") into separate forecasts unless the joint event is the
  actual user ask.
- **Name the source of truth.** Say which document, index, or announcement
  settles the question.

## Common errors

<!-- prolepsia:errors:start -->
- `permission_denied: connection is missing required scope 'forecasts:write'` —
  reconnect and approve write access, or create an API key with both
  `forecasts:read` and `forecasts:write` in Settings -> API and AI clients.
- `permission_denied: connection is missing required scope 'questions:write'` —
  the connection cannot use `normalize_question`. Write the question yourself and
  carry on; this is not a failure.
- `permission_denied: observers cannot create forecasts` — the account is
  an observer on its organization. Nothing to retry.
- `permission_denied: this account is suspended and cannot create forecasts` —
  tell the user to contact Prolepsia. Nothing to retry.
- `not_found: forecast task <taskId> is not visible to this connection` — the
  id is wrong, or it belongs to another account.
- `not_found: question <questionId> is not visible to this connection` — same,
  for `questionId`.
- `not_found: question <questionId> has no forecast schedule` — nothing is
  scheduled for it. Use `set_schedule` to add one.
- `invalid_request: taskId is not a valid UUID: <taskId>` — you passed
  something other than the `id` from a task envelope.
- `invalid_request: <field errors>` — the question payload failed
  validation. The message names the field; fix it and retry once. The
  usual cause is a missing `scaleType` on a numeric question, bounds on
  a type that does not take them, or a schedule faster than every 3 hours
  or longer than 50 runs.
- `rate_limit_error: per-connection limit exceeded; retry after <n>s` — wait the
  indicated seconds and retry. Do not loop tighter.
- `service_unavailable: question normalization is temporarily unavailable; write the question yourself using the payload shapes` —
  exactly that. Skip normalization and continue.
<!-- prolepsia:errors:end -->

### Not errors

- **`wait_for_forecast` returning `waitTimedOut: true`.** The run is
  still going. The response carries the current `status`,
  `progressMessage`, a `nextStep`, and how many subforecasts have
  finished. Follow it: report the count, wait a few minutes, and call
  `get_forecast`. Do not re-create and do not cancel.
- **A transport-level failure on `wait_for_forecast`** (connection reset,
  client timeout, gateway error). Long blocking calls get severed for
  reasons that have nothing to do with the forecast. Call `get_forecast`
  to find out where the run actually is.

## When NOT to use these tools

- Past events ("did X happen") — those are research questions, use
  whatever search/research tools you have instead.
- Math / arithmetic — Prolepsia forecasts uncertain real-world outcomes,
  not deterministic computations.
- Questions without a clear future resolution event.
- Anything you can look up. A forecast costs minutes to over an hour of
  compute; do not spend it on a fact.

## BB plugin adapter

In BB, use `prolepsia_tools` to discover the current tool names and input schemas,
then `prolepsia_call({name: "<remote tool name>", arguments: {...}})` to invoke
any tool described above. If native tools are unavailable, use
`bb prolepsia tools` and `bb prolepsia call <name> --args '<JSON object>'`.
Responses preserve MCP `isError`; treat it as a failure, never as forecast data.
Use pagination instead of `all=true`; limit is capped at 100. Wait calls are
limited to 55 seconds. Responses larger than 500,000 characters raise: narrow
read queries, and check existing forecasts before repeating a write.
Credentials belong in the Prolepsia plugin's secret API-key setting.
Do not put credentials into tool arguments or chat.
Only perform account mutations, share links, subscriptions, schedules, webhooks,
or forecast cancellations when the user authorizes the corresponding action.
