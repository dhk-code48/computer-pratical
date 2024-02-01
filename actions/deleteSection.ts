"use server";
import { db } from "@/lib/db";

export const deleteSection = async (sectionId: string) => {
  try {
    await db.section.delete({
      where: {
        id: sectionId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Section Deleated Success" };
};
