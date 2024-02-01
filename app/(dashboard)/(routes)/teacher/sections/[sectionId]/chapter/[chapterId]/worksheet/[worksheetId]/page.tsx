import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import WorksheetForm from "./_components/worksheet-form";
import { DataTable } from "./_components/data-table";
import BackButton from "@/components/back-button";

const TeacherWorksheetPage: FC<{
  params: { worksheetId: string; chapterId: string; sectionId: string };
}> = async ({ params }) => {
  const session = await auth();

  if (!session || !session.user.id) {
    redirect("/auth/login");
  }

  const worksheet = await db.workSheet.findUnique({
    where: {
      id: params.worksheetId,
    },
  });

  const studentsProgress =
    worksheet &&
    (await db.studentProgress.findMany({
      where: {
        worksheetId: worksheet.id,
      },
      include: {
        user: true,
      },
    }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Worksheet setup</h1>
        <BackButton />
      </div>
      <span className="text-sm text-slate-700">Customize your worksheet</span>
      <div className="mt-14 space-y-20">
        <WorksheetForm
          worksheet={worksheet}
          chapterId={params.chapterId}
          sectionId={params.sectionId}
          teacherId={session.user.id}
        />
      </div>
      {worksheet && studentsProgress && (
        <div className="mt-10">
          <DataTable
            studentsProgress={studentsProgress}
            worksheetId={params.worksheetId}
            chapterId={params.chapterId}
            sectionId={params.sectionId}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherWorksheetPage;
