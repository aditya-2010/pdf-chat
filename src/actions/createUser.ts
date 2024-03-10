"use server";

import { db } from "@/lib/db";

type PropType = {
  id: string;
  name: string;
  email: string;
};

// TODO: add zod validator
export const createUser = async ({ id, name, email }: PropType) => {
  try {
    await db.user.create({
      data: { id, name, email },
    });
  } catch (error) {
    console.log(error);
  }
};
