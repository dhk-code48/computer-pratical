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

  const batchs = await db.batch.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return (
    <>
      <div>
        <h2 className="mb-0 text-2xl font-bold">Batch Management</h2>
        <p className="text-gray-500 text-sm font-semibold">
          View and Manage batchs Info&apos;s
        </p>
      </div>
      <DataTable columns={columns} data={batchs} />
    </>
  );
};

export default GradePage;
