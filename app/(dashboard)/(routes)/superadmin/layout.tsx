import { auth } from "@/auth";
import BackButton from "@/components/back-button";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const SuperAdminLayout: FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
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

  return (
    <main className="p-6 space-y-5">
      <BackButton />
      {children}
    </main>
  );
};

export default SuperAdminLayout;
