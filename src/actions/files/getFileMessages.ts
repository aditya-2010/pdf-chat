"use server";

import { auth } from "@/auth";
import { INFINITE_QUERY_LIMIT } from "@/config/infiniteQueries";
import { db } from "@/lib/db";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100).nullish(),
});

export async function getFileMessages(input: z.infer<typeof InputSchema>) {
  const { cursor, limit, fileId } = input;

  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const user = await db.user.findFirst({
    where: { email: session.user.email },
  });
  const userId = user?.id;

  const limitRate = limit ?? INFINITE_QUERY_LIMIT;

  const file = await db.file.findFirst({
    where: { id: fileId, userId },
    select: { messages: true },
  });

  if (!file) return { error: "File not found" };

  const messages = await db.message.findMany({
    where: { fileId },
    take: limitRate + 1,
    orderBy: { createdAt: "desc" },
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      isUserMessage: true,
      text: true,
      createdAt: true,
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (messages.length > limitRate) {
    const nextItem = messages.pop();
    nextCursor = nextItem?.id;
  }

  return { messages, nextCursor };
}
