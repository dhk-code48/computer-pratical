"use server";

import { db } from "@/lib/db";
import { StudentProgress } from "@prisma/client";

export const updateStudentProgress = async (studentProgess: StudentProgress, grading: string) => {
  const { id } = studentProgess;

  try {
    await db.studentProgress.update({
      where: {
        id,
      },
      data: {
        grading,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Student Progress Updated Success" };
};
