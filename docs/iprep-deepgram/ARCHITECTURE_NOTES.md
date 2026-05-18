# QA Playground Architecture Notes

These notes describe how the current local voice interview prototype should map into a production Next.js and Supabase architecture.

## Current Prototype

The current app has three parts:

```text
Browser
  |
  | WebSocket /ws
  v
Express proxy
  |
  | Authorization: Token <DEEPGRAM_API_KEY>
  v
Deepgram Voice Agent
```

The browser handles:

- interview setup form
- microphone capture
- PCM conversion
- websocket connection
- audio playback
- transcript display

The server handles:

- `.env` loading
- allowed origin checks
- websocket proxying
- Deepgram authentication

The key architectural decision is that the browser talks only to your backend. Deepgram authentication stays server-side.

## Target Production Architecture

For QA Playground, use this shape:

```text
Next.js UI
  |
  | Supabase auth session
  | POST /api/interview/session
  v
Next.js API route
  |
  | create session + short-lived token
  v
Supabase

Next.js UI
  |
  | wss://.../interview/ws?sessionId=...&token=...
  v
WebSocket proxy service
  |
  | Authorization: Token <DEEPGRAM_API_KEY>
  v
Deepgram Voice Agent
```

Supabase should own user identity, session history, transcript persistence, and later analytics. The websocket proxy should own the realtime stream and the Deepgram secret.

## Trust Boundaries

### Browser

Trusted for user interaction only. It can:

- request microphone access
- send selected interview settings
- stream audio frames
- display transcript/audio events

It must not receive:

- Deepgram API key
- Supabase service role key
- unrestricted websocket access

### Next.js API

Trusted server layer. It should:

- verify the Supabase user
- create interview sessions
- issue short-lived websocket tokens
- validate user ownership before returning session data

### WebSocket Proxy

Trusted realtime backend. It should:

- validate `Origin`
- validate session token
- connect to Deepgram
- enforce payload and buffering limits
- forward allowed message types
- store transcript events server-side when possible

### Supabase

Trusted persistence and auth layer. It should:

- enforce RLS for user reads
- store interview sessions
- store transcript messages
- support future scoring and analytics

## Why Not Browser Direct To Deepgram

Do not connect the browser directly to Deepgram with the long-lived API key.

The safer production pattern is:

```text
Browser -> Your backend -> Deepgram
```

This prevents key exposure, lets you enforce user authentication, and gives you one place to rate limit, log, and stop abusive sessions.

## WebSocket Hosting Decision

The main architecture risk is hosting. Some Next.js deployments do not support long-lived websocket upgrade handling in API routes.

Before implementation, decide one of these:

1. Custom Next.js Node server

Use this if QA Playground already runs as a Node server where you can handle `upgrade` events.

2. Separate websocket service

Use this if the main app is deployed serverlessly. The service can be a small Node process using `ws`, deployed on infrastructure that supports websockets.

3. Platform-native realtime worker

Use this only if the platform supports raw binary websocket frames cleanly and can hold long-lived connections.

The simplest reliable production approach is usually a separate Node websocket service.

## Data Model

Minimum durable model:

```text
interview_sessions
  id
  user_id
  status
  role
  company_style
  focus
  deepgram_request_id
  started_at
  ended_at
  created_at

interview_messages
  id
  session_id
  role
  content
  source
  created_at

interview_session_tokens
  id
  session_id
  token_hash
  expires_at
  used_at
  created_at
```

Later additions:

- `interview_scores`
- `interview_feedback`
- `interview_modes`
- `interview_usage_events`
- `interview_audio_metrics`

## Event Handling

Deepgram sends both text and binary messages.

Binary messages:

- PCM audio from the agent
- forward to the browser
- browser queues playback through `AudioContext`

Text messages:

- `Welcome`
- `SettingsApplied`
- `ConversationText`
- `UserStartedSpeaking`
- `AgentStartedSpeaking`
- `AgentThinking`
- `AgentAudioDone`
- `Warning`
- `Error`

Suggested handling:

- render `ConversationText` immediately in the UI
- store assistant and user `ConversationText` messages in Supabase
- clear queued playback on `UserStartedSpeaking`
- mark session failed on fatal `Error`
- mark session ended when the client stops or the upstream closes

## Security Controls

Production websocket proxy should include:

- required `Origin`
- exact origin allowlist
- authenticated user session or signed short-lived websocket token
- one-time token use
- session ownership validation
- websocket `maxPayload`
- message rate limits
- max concurrent sessions per user
- max concurrent sessions per IP if IP is available
- upstream connect timeout
- idle timeout
- first-message validation
- buffering caps while Deepgram connects
- structured logs without secrets

Do not rely on `Origin` alone. Treat it as a useful browser safety check, not authentication.

## Suggested Module Boundaries

```text
lib/interview/deepgram-settings.ts
```

Builds the `Settings` payload. Pure logic. Easy to test.

```text
lib/interview/audio.ts
```

Browser audio conversion helpers. Client-only import.

```text
lib/interview/events.ts
```

Normalizes Deepgram text events and maps them to UI/session state.

```text
lib/interview/session-token.ts
```

Creates, hashes, validates, and consumes websocket session tokens.

```text
server/interview-ws.ts
```

Owns websocket upgrade handling and Deepgram proxying.

```text
lib/supabase/server.ts
```

Creates server-side Supabase clients for user auth and database writes.

## Migration Plan

Phase 1: Port the prototype.

- Build `/interview` UI.
- Port the browser audio and playback helpers.
- Add a Node websocket proxy.
- Connect to Deepgram with a server-side key.

Phase 2: Add Supabase persistence.

- Create interview session before websocket start.
- Store transcript messages.
- Show past sessions to the user.

Phase 3: Harden production behavior.

- Add short-lived websocket tokens.
- Add rate limits and payload caps.
- Add reconnect/error handling.
- Add structured logging.

Phase 4: Productize.

- Add interview mode presets.
- Add scoring and feedback.
- Add saved practice history.
- Add usage limits by plan or role.

## Key Implementation Warning

Do not copy the prototype server exactly into production. The important behavior is correct, but the production version needs authenticated sessions, one-time websocket tokens, resource limits, and Supabase persistence.

The code worth preserving directly is mostly the browser audio flow and the Deepgram settings shape. The proxy concept should be preserved, but the production proxy should be stricter.

