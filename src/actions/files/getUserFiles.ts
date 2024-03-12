"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function getUserFiles() {
  const { userId } = await auth();

  if (!userId) return null;

  return await db.file.findMany({ where: { userId } });
}
