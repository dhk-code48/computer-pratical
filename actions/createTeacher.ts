"use server";

import { TeacherSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const createTeacher = async (values: z.infer<typeof TeacherSchema>) => {
  const validatedFields = TeacherSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, email, password, sections } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
        sections: {
          connect: sections.map((sectionId) => ({ id: sectionId })),
        },
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Teacher Created Success" };
};
