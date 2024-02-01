"use client";

import { Chapter, StudentProgress, WorkSheet } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<StudentProgress>[] = [
  {
    accessorKey: "worksheet",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Worksheet Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const worksheet: WorkSheet = row.getValue("worksheet");
      return <div>{worksheet.name}</div>;
    },
  },
  {
    accessorKey: "chapter",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Chapter
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const worksheet: { chapter: Chapter } = row.getValue("worksheet");
      return <div>{worksheet.chapter.name}</div>;
    },
  },
  {
    accessorKey: "grading",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grades
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const grading: string = row.getValue("grading");
      return (
        <div className="flex items-center">
          <p
            className={`px-5 font-bold text-white rounded-full ${
              grading === "N" ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {grading === "N" ? "Incompleted" : grading}
          </p>
        </div>
      );
    },
  },
];
