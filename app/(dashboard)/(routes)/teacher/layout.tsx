import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const TeacherLayout: FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  if (session.user.role !== "TEACHER" && session.user.role === "SUPERADMIN") {
    redirect("/superadmin/grades");
  }
  if (session.user.role !== "TEACHER" && session.user.role === "STUDENT") {
    redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
