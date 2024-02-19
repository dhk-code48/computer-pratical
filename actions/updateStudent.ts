"use server";

import { TeacherSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const updateStudent = async (
  values: z.infer<typeof TeacherSchema>,
  teacherId: string
) => {
  const { name, email, password, sections } = values;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await db.user.update({
      where: {
        id: teacherId,
      },
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
    console.log("ERRORAT_UPDATETEACHER");
    return { error: "Something went wrong" };
  }

  return { success: "Student info updated Successfully" };
};
