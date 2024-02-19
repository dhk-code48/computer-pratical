"use server";

import { redirect } from "next/navigation";

// import { ExamSubject, Subject } from "@prisma/client";
import { db } from "./db";

const writeXlsxFile = require("write-excel-file/node");
const DEFAULT_HEADER_ROW = [
  {
    value: "Regestration Number",
    fontWeight: "bold",
  },
  {
    value: "Name",
    fontWeight: "bold",
  },
  {
    value: "Email",
    fontWeight: "bold",
  },
  {
    value: "Password",
    fontWeight: "bold",
  },
];

const data = [DEFAULT_HEADER_ROW];
export const downloadFile = async () => {
  const date = new Date().toDateString();
  await writeXlsxFile(data, {
    filePath: `./public/excel/${date}.xlsx`,
  });
  redirect(`/excel/${date}.xlsx`);
};
