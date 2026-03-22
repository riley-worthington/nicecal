# Sync Engine

The app works fully offline using a local IndexedDB (Dexie) database. When a user signs in with Clerk, their events sync bidirectionally with a PostgreSQL server. The sync uses a **push-then-pull** strategy with **last-write-wins (LWW)** conflict resolution.

## Event lifecycle

Every local event has a `syncStatus` field that tracks where it is in the sync pipeline:

| Status      | Meaning                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `"local"`   | Created offline or before sign-in. Not yet eligible for sync.           |
| `"pending"` | Modified locally and queued for upload on the next push.                |
| `"synced"`  | Successfully round-tripped to the server.                               |

When an event is created it starts as `"local"`. Any mutation (update, delete) flips it to `"pending"`. After a successful push, the server confirms synced IDs and the client marks them `"synced"`.

## Push (client -> server)

1. Query Dexie for all events where `syncStatus === "pending"`.
2. POST them to `/api/sync`.
3. The server upserts each event into PostgreSQL, scoped to the authenticated `userId`. It uses LWW: the incoming event is only written if its `updatedAt` is >= the existing row's.
4. The server returns the IDs it accepted. The client marks those `"synced"` in Dexie.

## Pull (server -> client)

1. Read the local **sync watermark** — an ISO timestamp of the last successful pull.
2. GET `/api/sync?since=<watermark>` to fetch only events updated after that point.
3. For each remote event:
   - **New locally**: insert into Dexie as `"synced"`.
   - **Exists locally and is not `"pending"`**: overwrite if the remote `updatedAt` is newer (LWW).
   - **Exists locally and is `"pending"`**: skip — local changes take priority until they're pushed.
4. Save the `serverTime` from the response as the new watermark.

## Full sync

A full sync runs **push first, then pull**. This ensures the server has the client's latest changes before the client pulls, avoiding unnecessary conflicts.

## When sync runs

- **On mount** when the user is signed in (`useSyncEngine` hook).
- **When the browser comes back online** (listens for the `online` event).
- **After local writes** — components call `triggerPush()` via the `SyncProvider` context to flush pending events immediately.
- **On first sign-in** — the `InitialSyncPrompt` modal detects pre-existing `"local"` events and offers to upload them. If the user accepts, all local events are marked `"pending"` and a full sync runs. If they skip, a pull-only sync still runs to fetch any server-side events.

## Sign-out

When the user signs out, IndexedDB is cleared (`db.events.clear()` + `db.syncMeta.clear()`) so no personal data remains on the device.

## Server API (`/api/sync`)

Both endpoints require Clerk authentication. Unauthenticated requests receive a 401.

- **GET** `/api/sync?since=<ISO timestamp>` — returns all events for the authenticated user updated after `since`. Omit `since` to get everything.
- **POST** `/api/sync` — accepts `{ events: [...] }`, upserts each event for the authenticated user, and returns `{ syncedIds, serverTime }`. Events belonging to a different user are silently skipped.

## Data isolation

Events in PostgreSQL are scoped to `userId` (from Clerk). All server queries filter by the authenticated user's ID, and the POST endpoint has an explicit ownership check that prevents writing to another user's events. On the client side, IndexedDB is inherently per-origin and per-browser.
