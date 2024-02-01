"use server";
import { db } from "@/lib/db";

export const deleteWorksheet = async (worksheetId: string) => {
  try {
    await db.workSheet.delete({
      where: {
        id: worksheetId,
      },
    });

    await db.studentProgress.deleteMany({
      where: {
        worksheetId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Chapter Deleated Success" };
};
