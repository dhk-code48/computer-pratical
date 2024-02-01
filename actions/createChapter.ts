"use server";

import { ChapterSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const createChapter = async (values: z.infer<typeof ChapterSchema>) => {
  const validatedFields = ChapterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, sectionId } = validatedFields.data;

  try {
    await db.chapter.create({
      data: {
        name,
        sectionId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Chapter Created Success" };
};
