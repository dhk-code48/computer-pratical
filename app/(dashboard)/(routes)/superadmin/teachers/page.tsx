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
    <div className="p-6">
      <DataTable columns={columns} data={teachers} />
    </div>
  );
};

export default SuperAdminTeachersPage;
