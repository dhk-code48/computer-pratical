import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { auth } from "@/auth";
import { Form } from "react-hook-form";
import GradeFrom from "./_components/grade-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import BackButton from "@/components/back-button";

const CourseIdPage = async ({ params }: { params: { gradeId: string } }) => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const grade = await db.grade.findUnique({
    where: {
      id: params.gradeId,
    },
    include: {
      sections: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-10">
      <BackButton />
      <h1 className="text-2xl font-medium">Grade setup</h1>
      <span className="text-sm text-slate-700">Customize your grade and sections</span>

      <div>
        <GradeFrom grade={grade} />
        {grade && (
          <>
            <div className="flex items-center gap-x-2 mt-10">
              <IconBadge size="default" icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your Sections</h2>
            </div>
            <DataTable gradeId={grade.id} columns={columns} data={grade.sections} />
          </>
        )}
      </div>
    </div>
  );
};

export default CourseIdPage;
