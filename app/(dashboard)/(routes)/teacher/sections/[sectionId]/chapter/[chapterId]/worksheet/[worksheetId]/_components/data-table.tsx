"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentProgress, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentProgressRow from "./columns";

interface DataTableProps {
  studentsProgress: (StudentProgress & { user: User })[];
  worksheetId: string;
  chapterId: string;
  sectionId: string;
}

export function DataTable({
  studentsProgress,
  chapterId,
  sectionId,
  worksheetId,
}: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list student progess in this worksheets.</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[100px]">Roll No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gradings</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentsProgress.map((progress, index) => {
            return (
              <StudentProgressRow
                worksheetId={worksheetId}
                chapterId={chapterId}
                sectionId={sectionId}
                index={index}
                key={index + 1 + progress.id}
                studentProgress={progress}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
