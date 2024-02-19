import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { auth } from "@/auth";
import BatchForm from "./_components/batch-form";
import BackButton from "@/components/back-button";

const CourseIdPage = async ({ params }: { params: { batchId: string } }) => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const batch = await db.batch.findUnique({
    where: {
      id: params.batchId,
    },
  });

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-medium">Batch setup</h1>
      <span className="text-sm text-slate-700">
        Customize your batch info&apos;s
      </span>

      <div>
        <BatchForm batch={batch} />
      </div>
    </div>
  );
};

export default CourseIdPage;
