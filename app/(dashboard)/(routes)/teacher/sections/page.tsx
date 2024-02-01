import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "../../superadmin/grades/[gradeId]/_components/data-table";
import { columns } from "./_components/columns";

const TeacherSectionsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg font-semibold">Assigned Sections</h1>
      <DataTable columns={columns} data={session.user.sections} gradeId="" />
    </div>
  );
};

export default TeacherSectionsPage;
