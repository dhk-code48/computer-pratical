import React from "react";
import SectionFrom from "./_components/section-form";
import { db } from "@/lib/db";
import { DataTable } from "../../../../teachers/_components/data-table";
import { columns } from "../../../../teachers/_components/columns";
import BackButton from "@/components/back-button";

const SuperAdminSection = async ({
  params,
}: {
  params: { gradeId: string; sectionId: string };
}) => {
  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      gradeId: params.gradeId,
    },
    include: {
      users: {
        where: {
          role: "TEACHER",
        },
        include: {
          sections: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-10">
      <BackButton />
      <h1 className="text-2xl font-medium">Section setup</h1>
      <span className="text-sm text-slate-700">Customize your grade and sections</span>
      <div>
        <SectionFrom section={section} gradeId={params.gradeId} />
      </div>
      {section && (
        <div className="mt-10">
          <h1>Assigned Teacher</h1>
          <DataTable columns={columns} data={section.users} />
        </div>
      )}
    </div>
  );
};

export default SuperAdminSection;
