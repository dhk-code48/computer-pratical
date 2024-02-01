import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionAnalytics from "./_components/SectionAnalytics";

const TeacherAnalyticsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      sections: {
        include: {
          grade: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-10">
      {user && (
        <Tabs defaultValue={user.sections[0].id}>
          <TabsList>
            {user.sections.map((section) => {
              return (
                <TabsTrigger value={section.id} key={section.createdAt.toString()}>
                  {section.grade.name} {section.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {user.sections.map((section) => {
            return (
              <TabsContent value={section.id} key={section.id}>
                <SectionAnalytics
                  sectionId={section.id}
                  grade={section.grade}
                  userId={session.user.id}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default TeacherAnalyticsPage;
