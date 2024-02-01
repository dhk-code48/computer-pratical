"use server";

import { SectionSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const createSection = async (values: z.infer<typeof SectionSchema>, gradeId: string) => {
  const validatedFields = SectionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await db.section.create({
      data: {
        gradeId,
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Section Created Success" };
};
