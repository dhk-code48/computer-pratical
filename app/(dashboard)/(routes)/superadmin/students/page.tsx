import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { useBatchStore } from "@/lib/batch-store";

const SuperAdminTeachersPage = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const students = await db.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      sections: true,
    },
  });
  const grades = await db.grade.findMany({ include: { sections: true } });
  return (
    <>
      <div className="prose">
        <h2 className="mb-0 text-2xl font-bold">Student Management</h2>
        <p className="text-gray-500 text-sm font-semibold">
          View and Manage students Info&apos;s
        </p>
      </div>
      <DataTable grades={grades} columns={columns} data={students} />
    </>
  );
};

export default SuperAdminTeachersPage;
