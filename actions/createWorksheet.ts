import { WorkSheet } from "@prisma/client";

export const createWorksheet = async (data: FormData): Promise<WorkSheet | null> => {
  try {
    const baseurl = "http://localhost:3000";
    const apiUrl = baseurl + "/api/upload";

    if (!baseurl) return null;

    const newWorkSheet = await fetch(apiUrl, {
      method: "POST",
      body: data,
    }).then((res) => res && res.json());

    return newWorkSheet;
  } catch {
    return null;
  }
};
