import { WorkSheet } from "@prisma/client";

export const updateWorksheet = async (
  data: FormData
): Promise<WorkSheet | null> => {
  try {
    const baseurl = "http://129.150.50.164:3002";
    const apiUrl = baseurl + "/api/upload";

    if (!baseurl) return null;

    const newWorkSheet = await fetch(apiUrl, {
      method: "PUT",
      body: data,
    }).then((res) => res && res.json());

    if (newWorkSheet.error) {
      return null;
    } else {
      return newWorkSheet;
    }
  } catch {
    return null;
  }
};
