"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import * as z from "zod";

const InputSchema = z.object({
  key: z.string(),
});

export async function getFile(input: z.infer<typeof InputSchema>) {
  const { userId } = auth();

  if (!userId) return null;

  const file = await db.file.findFirst({
    where: { key: input.key, userId: userId },
  });

  if (!file) return { error: "File not found" };

  return file;
}
