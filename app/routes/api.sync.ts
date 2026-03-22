import { getAuth } from "@clerk/remix/ssr.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { prisma } from "~/db/prisma.server";

interface SyncEventPayload {
  id: string;
  title: string;
  startTime: string;
  endTime?: string | null;
  deleted: boolean;
  updatedAt: string;
}

/**
 * GET /api/sync?since=<ISO timestamp>
 * Returns all events for the authenticated user updated after `since`.
 * If `since` is omitted, returns all events.
 */
export async function loader({ request, ...rest }: LoaderFunctionArgs) {
  const { userId } = await getAuth({ request, ...rest });
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const since = url.searchParams.get("since");

  const where: { userId: string; updatedAt?: { gt: Date } } = { userId };
  if (since) {
    where.updatedAt = { gt: new Date(since) };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { updatedAt: "asc" },
  });

  return Response.json({
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime?.toISOString() ?? null,
      deleted: e.deleted,
      updatedAt: e.updatedAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
    })),
    serverTime: new Date().toISOString(),
  });
}

/**
 * POST /api/sync
 * Accepts an array of events to upsert for the authenticated user.
 * Returns the IDs of successfully synced events.
 */
export async function action({ request, ...rest }: ActionFunctionArgs) {
  const { userId } = await getAuth({ request, ...rest });
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { events: SyncEventPayload[] };
  if (!body.events || !Array.isArray(body.events)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const syncedIds: string[] = [];

  for (const event of body.events) {
    const existing = await prisma.event.findUnique({ where: { id: event.id } });

    if (existing && existing.userId !== userId) {
      continue;
    }

    if (existing) {
      if (new Date(event.updatedAt) >= existing.updatedAt) {
        await prisma.event.update({
          where: { id: event.id },
          data: {
            title: event.title,
            startTime: new Date(event.startTime),
            endTime: event.endTime ? new Date(event.endTime) : null,
            deleted: event.deleted,
            updatedAt: new Date(event.updatedAt),
          },
        });
      }
    } else {
      await prisma.event.create({
        data: {
          id: event.id,
          userId,
          title: event.title,
          startTime: new Date(event.startTime),
          endTime: event.endTime ? new Date(event.endTime) : null,
          deleted: event.deleted,
          createdAt: new Date(),
          updatedAt: new Date(event.updatedAt),
        },
      });
    }

    syncedIds.push(event.id);
  }

  return Response.json({ syncedIds, serverTime: new Date().toISOString() });
}
