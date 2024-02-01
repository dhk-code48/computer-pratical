"use server";
import { db } from "@/lib/db";

export const deleteTeacher = async (teacherId: string) => {
  try {
    await db.user.delete({
      where: {
        id: teacherId,
      },
    });

    await db.workSheet.deleteMany({
      where: {
        teacherId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Teacher Deleated Success" };
};
