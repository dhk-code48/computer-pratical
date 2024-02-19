import React from "react";
import TeacherForm from "./_components/student-form";
import { db } from "@/lib/db";
import { Section, UserRole } from "@prisma/client";

const SuperAdminTeacherPage = async ({
  params,
}: {
  params: { studentId: string };
}) => {
  const grades = await db.grade.findMany({ include: { sections: true } });
  const teacher = await db.user.findUnique({
    where: {
      id: params.studentId,
    },
    include: {
      sections: true,
    },
  });
  return (
    <div className="grid grid-col p-6 items-center mt-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Add New Teacher</h1>
      <p className="text-sm text-muted-foreground">
        Create and modify students
      </p>

      <TeacherForm
        student={teacher}
        studentId={params.studentId}
        className="lg:w-[400px] mt-10"
        grades={grades}
      />
    </div>
  );
};

export default SuperAdminTeacherPage;
