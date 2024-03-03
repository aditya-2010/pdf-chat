"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const InputSchema = z.object({
  fileId: z.string(),
});

export async function getFileUploadStatus(input: z.infer<typeof InputSchema>) {
  const session = await auth();

  const file = await db.file.findFirst({
    where: { id: input.fileId, userId: session?.user?.id },
  });

  if (!file) return { status: "PENDING" as const };

  return { status: file.uploadStatus };
}
