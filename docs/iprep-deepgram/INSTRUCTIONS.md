# QA Playground Integration Instructions

Use this guide to move the local Deepgram interview prototype into `qaplayground.com`, assuming the production app is built with Next.js and Supabase.

## Goal

Add a real-time voice interview practice feature to QA Playground where:

- signed-in users can start an interview session from the browser
- microphone audio streams to a backend-owned websocket proxy
- the backend connects to Deepgram Voice Agent using the server-side API key
- Deepgram returns transcript events and interviewer audio
- Supabase stores session metadata and final transcript/history

The browser must never receive the Deepgram API key.

## Recommended Next.js Shape

Use the existing local prototype as the behavior reference, but split it into production-friendly pieces.

```text
qaplayground.com
  app/
    interview/
      page.tsx
      InterviewPracticeClient.tsx
    api/
      interview/
        session/
          route.ts
  lib/
    interview/
      deepgram-settings.ts
      audio.ts
      transcript.ts
    supabase/
      server.ts
      client.ts
  server/
    interview-ws.ts
```

Recommended responsibilities:

- `app/interview/page.tsx`: server component that checks auth and renders the interview UI.
- `InterviewPracticeClient.tsx`: browser-only component for mic capture, websocket client, playback, statuses, and transcript rendering.
- `app/api/interview/session/route.ts`: creates a short-lived interview session record and returns a websocket URL plus session token.
- `server/interview-ws.ts`: websocket proxy from browser to Deepgram.
- `lib/interview/deepgram-settings.ts`: builds the Deepgram `Settings` payload from user-selected role, company, focus, and mode.
- `lib/interview/audio.ts`: browser audio helpers ported from `public/app.js`.
- `lib/interview/transcript.ts`: normalizes Deepgram events before storing or displaying them.

## Environment Variables

Add these to the deployment environment, not to client-exposed env vars:

```env
DEEPGRAM_API_KEY=your_server_side_key
DEEPGRAM_AGENT_URL=wss://agent.deepgram.com/v1/agent/converse
INTERVIEW_WS_ORIGIN=https://qaplayground.com
INTERVIEW_SESSION_TTL_SECONDS=300
```

For local development:

```env
INTERVIEW_WS_ORIGIN=http://localhost:3000
```

Do not use `NEXT_PUBLIC_` for the Deepgram key.

## Supabase Schema

Start with three tables.

```sql
create table interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'created',
  role text not null,
  company_style text,
  focus text,
  deepgram_request_id text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table interview_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references interview_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  source text not null default 'deepgram',
  created_at timestamptz not null default now()
);

create table interview_session_tokens (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references interview_sessions(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
```

Enable RLS:

```sql
alter table interview_sessions enable row level security;
alter table interview_messages enable row level security;
alter table interview_session_tokens enable row level security;
```

Suggested policies:

```sql
create policy "Users can read own interview sessions"
on interview_sessions for select
using (auth.uid() = user_id);

create policy "Users can read own interview messages"
on interview_messages for select
using (
  exists (
    select 1
    from interview_sessions s
    where s.id = interview_messages.session_id
      and s.user_id = auth.uid()
  )
);
```

Perform inserts and token validation from server code with a service-role client only where necessary. Never expose the service role key to the browser.

## Session Start Flow

1. User opens `/interview`.
2. Server checks Supabase auth.
3. User fills role, company style, and focus.
4. Browser calls `POST /api/interview/session`.
5. API route validates the user, creates `interview_sessions`, creates a short-lived random token, stores only a hash, and returns:

```json
{
  "sessionId": "uuid",
  "wsUrl": "wss://qaplayground.com/api/interview/ws?sessionId=...&token=..."
}
```

6. Browser opens the websocket.
7. Backend validates origin, user/session token, token expiry, and one-time use.
8. Backend opens Deepgram websocket with `Authorization: Token <DEEPGRAM_API_KEY>`.
9. Browser sends Deepgram `Settings`.
10. Browser streams binary PCM audio frames.
11. Backend forwards frames and events between browser and Deepgram.
12. Backend stores final transcript messages and session status in Supabase.

## Client Code To Port

Move these functions from `public/app.js` into typed frontend utilities:

- `downsampleBuffer`
- `floatTo16BitPCM`
- `int16ToFloat32`
- `playPcmChunk`
- `clearPlayback`
- `startMicrophone`
- `buildSettings`

Keep these browser-only APIs inside a client component:

- `navigator.mediaDevices.getUserMedia`
- `AudioContext`
- `MediaStreamSource`
- `ScriptProcessorNode` or the future `AudioWorklet`
- `WebSocket`

The current `ScriptProcessorNode` works, but for production prefer `AudioWorklet` when time allows.

## Backend Code To Port

Move the websocket proxy behavior from `src/server.js`, but harden it before production:

- require an allowed `Origin`
- require an authenticated, short-lived session token
- set websocket `maxPayload`
- cap buffered messages before Deepgram opens
- cap total buffered bytes
- require the first client message to be valid `Settings`
- close idle sessions
- close sessions that never send audio
- log a server-side session id for every connection

Do not expose `/config` in production unless the response is generic and authenticated.

## Deepgram Settings Payload

The current payload should remain the starting point:

```js
{
  type: "Settings",
  audio: {
    input: {
      encoding: "linear16",
      sample_rate: 24000
    },
    output: {
      encoding: "linear16",
      sample_rate: 24000,
      container: "none"
    }
  },
  agent: {
    language: "en",
    greeting: "Hi, I am your interviewer...",
    listen: {
      provider: {
        type: "deepgram",
        model: "flux-general-en"
      }
    },
    think: {
      provider: {
        type: "open_ai",
        model: "gpt-4o-mini",
        temperature: 0.4
      },
      prompt: "..."
    },
    speak: {
      provider: {
        type: "deepgram",
        model: "aura-2-asteria-en"
      }
    }
  }
}
```

For QA Playground, generate the prompt from selected interview mode:

- manual QA interview
- automation QA interview
- Selenium or Playwright interview
- API testing interview
- performance testing interview
- behavioral interview
- mixed round

## Deployment Notes

Next.js API routes are not always a good fit for long-lived websockets on serverless platforms. Confirm the hosting model before implementing.

Recommended production options:

- custom Next.js Node server with websocket upgrade handling
- separate small websocket service deployed beside the Next.js app
- a platform that explicitly supports websocket servers

If QA Playground is deployed to a serverless-only environment that does not support websocket upgrades, keep the websocket proxy in a separate Node service.

## Acceptance Checklist

- A signed-in user can create an interview session.
- The browser never receives `DEEPGRAM_API_KEY`.
- `/interview` can start and stop a voice session.
- Deepgram sends `Welcome` and `SettingsApplied`.
- User audio streams as binary PCM frames.
- Agent audio plays in the browser.
- Transcript messages appear live.
- Final transcript messages are stored in Supabase.
- Stopping the interview closes browser and upstream sockets.
- Invalid origins, expired tokens, and unauthenticated requests are rejected.
- The deployment platform supports the websocket proxy.

