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
  const publishedWorksheets = await db.workSheet.findMany({
    where: {
      published: true,
      chapter: {
        sectionId: { in: sections },
      },
    },
  });

  try {
    const user = await db.user.create({
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
    const studentProgressData = publishedWorksheets.map((worksheet) => ({
      userId: user.id,
      worksheetId: worksheet.id,
      grading: "N",
    }));
    await db.studentProgress.createMany({
      data: studentProgressData,
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Student added Success" };
};
