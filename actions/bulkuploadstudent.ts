"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Row } from "read-excel-file";

export const createBulkStudent = async (rows: Row[], sectionId: string) => {
  try {
    rows.forEach(async (data, i) => {
      const regestrationNumber = data[0].toString();
      const name = data[1].toString();
      const email = data[2].toString();
      const nonHashedpassword = data[3].toString();
      const password = await bcrypt.hash(nonHashedpassword, 12);

      i !== 0 &&
        (await db.user.create({
          data: {
            name,
            regestrationNumber,
            email,
            password,
            role: "STUDENT",
            sections: {
              connect: { id: sectionId },
            },
          },
        }));
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Students added Success" };
};
