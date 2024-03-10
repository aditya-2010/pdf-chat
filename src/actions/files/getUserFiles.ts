"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function getUserFiles() {
  const userId = cookies().get("session")?.value;

  if (!userId) return null;

  return await db.file.findMany({ where: { userId } });
}
