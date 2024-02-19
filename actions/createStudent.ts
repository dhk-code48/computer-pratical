"use server";

import { StudentSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const createStudent = async (values: z.infer<typeof StudentSchema>) => {
  const validatedFields = StudentSchema.safeParse(values);

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
        role: "STUDENT",
        sections: {
          connect: sections.map((sectionId) => ({ id: sectionId })),
        },
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Student added Success" };
};
