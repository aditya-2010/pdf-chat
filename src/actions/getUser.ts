"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUser() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const dbUser = await db.user.findFirst({
    where: { email: session.user.email },
  });

  if (!dbUser) return { error: "User not found" };

  return dbUser;
}
