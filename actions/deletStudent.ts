"use server";
import { db } from "@/lib/db";

export const deleteStudent = async (studentId: string) => {
  try {
    await db.user.delete({
      where: {
        id: studentId,
      },
    });

    await db.studentProgress.deleteMany({
      where: {
        userId: studentId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Student Deleated Success" };
};
