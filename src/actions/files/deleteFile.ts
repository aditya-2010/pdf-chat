"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function deleteFile(inputFileObject: { id: string }) {
  const userId = cookies().get("session")?.value || "";

  if (!userId) return null;

  try {
    const file = await db.file.findFirst({
      where: { id: inputFileObject.id, userId: userId },
    });

    await db.file.delete({ where: { id: inputFileObject.id } });
    return { success: "File delete successful" };
  } catch (error) {
    return { error: "File delete failed", message: error };
  }
}
