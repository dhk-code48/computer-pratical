"use server";

import { GradeSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const createGrade = async (values: z.infer<typeof GradeSchema>) => {
  const validatedFields = GradeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await db.grade.create({
      data: {
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Grade Created Success" };
};
