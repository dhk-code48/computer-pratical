import InfoCard from "@/components/info-card";
import { db } from "@/lib/db";
import { Grade } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const SectionAnalytics: FC<{
  sectionId: string;
  userId: string | undefined;
  grade: Grade;
}> = async ({ sectionId, grade, userId }) => {
  const totalChapters = await db.chapter.count({
    where: {
      sectionId,
    },
  });
  if (!userId) {
    redirect("/auth/login");
  }
  const totalWorksheet = await db.workSheet.count({
    where: {
      teacherId: userId,
      chapter: {
        sectionId,
      },
    },
  });

  const totalPublishedWorksheet = await db.workSheet.count({
    where: {
      teacherId: userId,
      published: true,
      chapter: {
        sectionId,
      },
    },
  });

  //   const totalWorksheet = await db.workSheet.findMany({
  //     where: {
  //       teacherId: userId,
  //     },
  //     include:{
  //         chapter:
  //     }
  //   });
  return (
    <div className="flex gap-x-10 gap-y-5 items-center justify-start">
      <InfoCard title="Chapters" value={totalChapters.toString()} />
      <InfoCard title="Worksheets" value={totalWorksheet.toString()} />
      <InfoCard
        title="Published Worksheets"
        value={totalPublishedWorksheet.toString()}
        description={
          "Total Unpublished Worksheets is " +
          (totalWorksheet - totalPublishedWorksheet)
        }
      />
    </div>
  );
};

export default SectionAnalytics;
