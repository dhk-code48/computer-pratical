import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import BackButton from "@/components/back-button";

const TeacherWorkSheetSection: FC<{ params: { sectionId: string } }> = async ({ params }) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const section = session.user.sections.filter((sec) => sec.id === params.sectionId)[0];

  const chapters = await db.chapter.findMany({
    where: {
      sectionId: section.id,
    },
  });

  console.log(chapters);

  return (
    <div className="p-6 space-y-10">
      <BackButton />

      <DataTable sectionId={params.sectionId} columns={columns} data={chapters} />
    </div>
  );
};

export default TeacherWorkSheetSection;
