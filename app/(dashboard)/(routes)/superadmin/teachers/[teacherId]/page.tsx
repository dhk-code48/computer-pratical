import React from "react";
import TeacherForm from "./_components/teacher-form";
import { db } from "@/lib/db";
import { Section, User } from "@prisma/client";

const SuperAdminTeacherPage = async ({
  params,
}: {
  params: { teacherId: string };
}) => {
  const grades = await db.grade.findMany({ include: { sections: true } });
  const teacher = await db.user.findUnique({
    where: {
      id: params.teacherId,
    },
    include: {
      sections: { include: { grade: true } },
    },
  });
  return (
    <div className="grid grid-col p-6 items-center mt-auto">
      <h1 className="text-2xl font-semibold tracking-tight">
        {teacher ? "Update Teacher Info" : "Add New Teacher"}
      </h1>
      <p className="text-sm text-muted-foreground">
        Create and modify teachers
      </p>

      <TeacherForm
        teacher={teacher}
        teacherId={params.teacherId}
        className="lg:w-[400px] mt-10"
        grades={grades}
      />
    </div>
  );
};

export default SuperAdminTeacherPage;
