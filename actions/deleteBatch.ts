"use server";

import { db } from "@/lib/db";

export const deleteBatch = async (batchId: string) => {
  try {
    await db.batch.delete({
      where: {
        id: batchId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Batch Deleted Success" };
};
