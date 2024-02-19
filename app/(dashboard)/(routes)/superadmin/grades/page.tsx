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
    <>
      <div className="prose">
        <h2 className="mb-0 text-2xl font-bold">Grade Management</h2>
        <p className="text-gray-500 text-sm font-semibold">
          View and Manage grades Info&apos;s
        </p>
      </div>
      <DataTable columns={columns} data={grades} />
    </>
  );
};

export default GradePage;
