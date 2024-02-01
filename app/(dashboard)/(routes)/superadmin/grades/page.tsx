import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";

const GradePage = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const grades = await db.grade.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={grades} />
    </div>
  );
};

export default GradePage;
