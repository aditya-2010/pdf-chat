"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileUploadStatus(input: z.infer<typeof InputSchema>) {
  const userId = cookies().get("session")?.value;

  if (!userId) return null;

  const file = await db.file.findFirst({
    where: { id: input.fileId, userId: userId },
  });

  if (!file) return { status: "PENDING" as const };

  return { status: file.uploadStatus };
}
