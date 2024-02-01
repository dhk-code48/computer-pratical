import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import GradesPieChart from "./_components/PieChart";
import InfoCard from "./_components/info-card";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role === "TEACHER") {
    redirect("/teacher/sections");
  }
  if (session.user.role === "SUPERADMIN") {
    redirect("/superadmin/grades");
  }
  const studentProgresses = await db.studentProgress.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      grading: "desc",
    },
    include: {
      worksheet: {
        include: {
          chapter: true,
        },
      },
    },
  });

  const totalWorksheet = studentProgresses.length;
  const totalCompletedWorkSheet = studentProgresses.filter(
    (progress) => progress.grading !== "N"
  ).length;
  const totalIncompleteWorksheet = totalWorksheet - totalCompletedWorkSheet;

  const totalAPlus = studentProgresses.filter((progress) => progress.grading === "A+").length;
  const totalA = studentProgresses.filter((progress) => progress.grading === "A").length;
  const totalBPlus = studentProgresses.filter((progress) => progress.grading === "B+").length;
  const totalB = studentProgresses.filter((progress) => progress.grading === "B").length;
  const totalCPlus = studentProgresses.filter((progress) => progress.grading === "C+").length;
  const totalC = studentProgresses.filter((progress) => progress.grading === "C").length;

  const data = [
    { name: "A+", value: totalAPlus },
    { name: "A", value: totalA },
    { name: "B+", value: totalBPlus },
    { name: "B", value: totalB },
    { name: "C+", value: totalCPlus },
    { name: "C", value: totalC },
    { name: "Incomplete", value: totalIncompleteWorksheet },
  ];

  const weights: { [key: string]: number } = {
    "A+": 4.0,
    A: 3.6,
    "B+": 3.2,
    B: 2.8,
    "C+": 2.4,
    C: 2.0,
    Incomplete: 0.0,
  };

  let weightedSum = 0;
  data.forEach((grade) => {
    weightedSum += weights[grade.name] * grade.value;
  });

  const overallGrade = weightedSum / totalCompletedWorkSheet;

  console.log("Overall Grade:", overallGrade);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg font-semibold">Welcome, {session.user.name}</h1>
      <div className="flex items-center justify-start gap-x-10 gap-y-5">
        <InfoCard title="Assigned Worksheets" value={totalWorksheet.toString()} description={""} />
        <InfoCard
          title="Completed Worksheets"
          value={totalCompletedWorkSheet.toString()}
          description={
            totalIncompleteWorksheet === 0
              ? "All Worksheets Completed"
              : totalIncompleteWorksheet + " Worksheets Reamaining"
          }
        />
      </div>
      <div>
        <h1 className="text-lg font-semibold">Your Grades</h1>
        <h5 className="text-gray-800 font-semibold">Overall Grade : {overallGrade}</h5>
      </div>

      <GradesPieChart data={data} />
    </div>
  );
};

export default DashboardPage;
