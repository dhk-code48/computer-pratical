import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";

const SuperAdminTeachersPage = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const teachers = await db.user.findMany({
    where: {
      role: "TEACHER",
    },
    include: {
      sections: true,
    },
  });
  return (
    <>
      <div className="prose">
        <h2 className="mb-0 text-2xl font-bold">Teacher Management</h2>
        <p className="text-gray-500 text-sm font-semibold">
          View and Manage teachers Info&apos;s
        </p>
      </div>
      <DataTable columns={columns} data={teachers} />
    </>
  );
};

export default SuperAdminTeachersPage;
