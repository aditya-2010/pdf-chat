"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const InputSchema = z.object({
  key: z.string(),
});

export async function getFile(input: z.infer<typeof InputSchema>) {
  const session = await auth();

  const file = await db.file.findFirst({
    where: { key: input.key, userId: session?.user?.id },
  });

  if (!file) return { error: "File not found" };

  return file;
}
