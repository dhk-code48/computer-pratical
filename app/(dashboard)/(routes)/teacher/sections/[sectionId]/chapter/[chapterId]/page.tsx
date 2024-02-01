import React, { FC } from "react";
import ChapterFrom from "./_components/chapter-form";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import BackButton from "@/components/back-button";

const TeacherChapterPage: FC<{ params: { sectionId: string; chapterId: string } }> = async ({
  params,
}) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
    include: {
      worksheets: true,
    },
  });

  return (
    <div className="p-6 space-y-10">
      <BackButton />
      <br />
      <ChapterFrom chapter={chapter} sectionId={params.sectionId} />
      {chapter && (
        <div className="mt-10">
          <DataTable
            columns={columns}
            data={chapter.worksheets}
            sectionId={params.sectionId}
            chapterId={params.chapterId}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherChapterPage;
