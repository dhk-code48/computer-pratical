import { redirect } from "next/navigation";
import React from "react";
import { auth } from "@/auth";
import BulkRegestrationForm from "./_components/student-regestration-form";
import { db } from "@/lib/db";
import { Grade } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const SuperAdminResultPage = async () => {
  const session = await auth();

  const grades = await db.grade.findMany({
    include: {
      sections: true,
    },
  });

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-0 text-2xl font-bold">Bulk Regestration</h2>
        <p className="text-gray-500 text-sm font-semibold">
          Add student in bulk using excel
        </p>
      </div>

      <BulkRegestrationForm grades={grades} />
    </div>
  );
};

export default SuperAdminResultPage;
