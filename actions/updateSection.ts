"use server";

import { SectionSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const updateSection = async (values: z.infer<typeof SectionSchema>, sectionId: string) => {
  const validatedFields = SectionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await db.section.update({
      where: {
        id: sectionId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Section Updated Success" };
};
