"use server";
import { db } from "@/lib/db";

export const deleteChapter = async (chapterId: string) => {
  try {
    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Chapter Deleated Success" };
};
