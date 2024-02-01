"use server";

import { ChapterSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const updateChapter = async (values: z.infer<typeof ChapterSchema>, chapterId: string) => {
  const validatedFields = ChapterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, sectionId } = validatedFields.data;

  try {
    await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        name,
        sectionId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Chapter Updated Success" };
};
