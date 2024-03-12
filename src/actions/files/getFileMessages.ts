"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileMessages(input: z.infer<typeof InputSchema>) {
  const { fileId } = input;

  const { userId } = auth();
  if (!userId) return { error: "Unauthorized" };

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
