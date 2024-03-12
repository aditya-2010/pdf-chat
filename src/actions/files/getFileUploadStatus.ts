"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileUploadStatus(input: z.infer<typeof InputSchema>) {
  const { userId } = auth();

  if (!userId) return null;

  const file = await db.file.findFirst({
    where: { id: input.fileId, userId: userId },
  });

  if (!file) return { status: "PENDING" as const };

  return { status: file.uploadStatus };
}
