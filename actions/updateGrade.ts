"use server";

import { GradeSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const updateGrade = async (values: z.infer<typeof GradeSchema>, gradeId: string) => {
  const validatedFields = GradeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await db.grade.update({
      where: {
        id: gradeId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Grade Updated Success" };
};
