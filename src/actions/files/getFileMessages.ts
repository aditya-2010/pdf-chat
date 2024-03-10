"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileMessages(input: z.infer<typeof InputSchema>) {
  const { fileId } = input;

  const userId = cookies().get("session")?.value;
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
