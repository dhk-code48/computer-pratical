"use client";

import * as React from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentProgress, User } from "@prisma/client";
import { updateStudentProgress } from "@/actions/updateStudentProgress";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";

const StudentProgressRow: React.FC<{
  index: number;
  worksheetId: string;
  chapterId: string;
  sectionId: string;
  studentProgress: StudentProgress & { user: User };
}> = ({ index, studentProgress, chapterId, sectionId, worksheetId }) => {
  const [grading, setGrading] = React.useState<string>("None");
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  React.useEffect(() => {
    setGrading(studentProgress.grading);
  }, [studentProgress]);

  const onsave = () => {
    if (grading !== studentProgress.grading) {
      React.startTransition(() => {
        setError("");
        setSuccess("");
        updateStudentProgress(studentProgress, grading)
          .then((data) => {
            if (data?.error) {
              setError(data.error);
            }

            if (data?.success) {
              setSuccess(data.success);
              window.location.assign(
                `/teacher/sections/${sectionId}/chapter/${chapterId}/worksheet/${worksheetId}`
              );
            }
          })
          .catch(() => setError("Something went wrong"));
        setError("");
        setSuccess("");
      });
    }
  };
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>{studentProgress.user.name}</TableCell>
        <TableCell>
          <Select value={grading} onValueChange={(e) => setGrading(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select A Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grades</SelectLabel>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C+">C+</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="N">Incompleted</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Button onClick={onsave}>Save</Button>
        </TableCell>
        <TableCell>
          <FormError message={error} />
          <FormSuccess message={success} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default StudentProgressRow;
