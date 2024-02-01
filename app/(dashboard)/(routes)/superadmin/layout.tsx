import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const SuperAdminLayout: FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  if (session.user.role !== "SUPERADMIN" && session.user.role === "TEACHER") {
    redirect("/teacher/sections");
  }
  if (session.user.role !== "SUPERADMIN" && session.user.role === "STUDENT") {
    redirect("/");
  }

  return <>{children}</>;
};

export default SuperAdminLayout;
