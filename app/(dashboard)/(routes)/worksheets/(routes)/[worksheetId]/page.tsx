"use client";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

const StudentWorkSheetPage: FC<{ params: { worksheetId: string } }> = ({ params }) => {
  const pdfLink = "http://localhost:3000/pdf/" + params.worksheetId + ".pdf";
  const router = useRouter();
  return (
    <div className="p-6 space-y-10">
      <BackButton />
      <object
        type="application/pdf"
        data={pdfLink}
        className="w-full h-screen lg:h-[90vh]"
      ></object>
    </div>
  );
};

export default StudentWorkSheetPage;
