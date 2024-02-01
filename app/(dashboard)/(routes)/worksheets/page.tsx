import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import BackButton from "@/components/back-button";

const DashboardWorksheets = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "STUDENT" && session.user.role === "TEACHER") {
    redirect("/teacher/sections");
  }
  if (session.user.role !== "STUDENT" && session.user.role === "SUPERADMIN") {
    redirect("/superadmin/grades");
  }
  const studentProgresses = await db.studentProgress.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      grading: "desc",
    },
    include: {
      worksheet: {
        include: {
          chapter: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Worksheets</h1>
        <BackButton />
      </div>
      <DataTable
        columns={columns}
        data={studentProgresses.filter((progress) => progress.worksheet.published)}
      />

      {/* {studentProgresses.map(
        (progress) => progress.worksheet.published && <div>{progress.worksheet.name}</div>
      )} */}
    </div>
  );
};

export default DashboardWorksheets;
