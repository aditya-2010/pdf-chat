"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function deleteFile(inputFileObject: { id: string }) {
  const session = await auth();

  if (!session?.user) return null;

  try {
    const file = await db.file.findFirst({
      where: { id: inputFileObject.id, userId: session.user.id },
    });

    await db.file.delete({ where: { id: inputFileObject.id } });
    return { success: "File delete successful" };
  } catch (error) {
    return { error: "File delete failed", message: error };
  }
}
