"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserFiles() {
  const session = await auth();

  if (!session?.user) return null;

  const { id } = session.user;

  return await db.file.findMany({ where: { id } });
}
