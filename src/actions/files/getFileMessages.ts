"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileMessages(input: z.infer<typeof InputSchema>) {
  const { fileId } = input;

  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const user = await db.user.findFirst({
    where: { email: session.user.email },
  });
  const userId = user?.id;

  const file = await db.file.findFirst({
    where: { id: fileId, userId },
    select: { messages: true },
  });

  if (!file) return { error: "File not found" };

  const messages = await db.message.findMany({
    where: { fileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      isUserMessage: true,
      text: true,
      createdAt: true,
    },
  });

  return { messages };
}
