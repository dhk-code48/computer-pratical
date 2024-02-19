"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Download, Filter, Upload } from "lucide-react";
import React, { FC, useEffect, useState, useTransition } from "react";
import readXlsxFile, { Row } from "read-excel-file";
import StudentTabel from "./student-table";
import { downloadFile } from "@/lib/downloadStudentSampleExcel";
import { Grade, Section } from "@prisma/client";
import { createBulkStudent } from "@/actions/bulkuploadstudent";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const BulkRegestrationForm: FC<{
  grades: (Grade & { sections: Section[] })[];
}> = ({ grades }) => {
  const [excelfile, setExcelFile] = useState<File | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [bulkData, setBulkData] = useState<Row[]>([]);

  useEffect(() => {
    async function readFile() {
      if (excelfile) {
        await readXlsxFile(excelfile).then((rows) => {
          setBulkData(rows);
        });
      }
    }
    readFile();
  }, [excelfile]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const handleBulkUpload = () => {
    setError("");
    setSuccess("");
    startTransition(() => {
      bulkData &&
        createBulkStudent(bulkData, selectedSection)
          .then((data) => {
            if (data?.error) {
              setError(data.error);
            }
            if (data?.success) {
              setSuccess(data.success);
              window.location.assign("/superadmin/students");
            }
          })
          .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <div className="px-10 space-y-5 py-5 rounded-lg bg-slate-100">
      <div className="flex items-center gap-x-5">
        <h4 className="font-semibold mb-0">Select Grade And Section</h4>
        <Filter size={18} />
      </div>
      <div className="flex flex-wrap gap-y-5 gap-x-10">
        <Select onValueChange={(value) => setSelectedGrade(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Grades</SelectLabel>
              {grades.map((grade) => (
                <SelectItem
                  value={grade.id}
                  key={"exam-filter-form " + grade.id}
                >
                  Grade : {grade.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedSection(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sections</SelectLabel>
              {grades
                .filter((grade) => grade.id === selectedGrade)[0]
                ?.sections.map((section) => (
                  <SelectItem
                    value={section.id}
                    key={"exam-filter-form " + section.id}
                  >
                    {section.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedGrade !== "" && selectedSection !== "" && (
          <>
            <Button className="gap-x-3" onClick={() => downloadFile()}>
              <Download size={16} />
              Download Excel Sample
            </Button>
            <div className="md:flex w-full max-w-sm items-center gap-1.5">
              <Button variant="ghost">Select Excel File</Button>
              <Input
                id="picture"
                type="file"
                placeholder="Import Excel File"
                onChange={(e) =>
                  setExcelFile(e.target.files && e.target.files[0])
                }
              />
            </div>
          </>
        )}
      </div>
      {selectedGrade !== "" && selectedSection !== "" && (
        <StudentTabel datas={bulkData} />
      )}
      <FormError message={error} />
      <FormSuccess message={success} />
      {bulkData.length > 0 && (
        <Button disabled={isPending} onClick={() => handleBulkUpload()}>
          Insert Student
        </Button>
      )}
    </div>
  );
};

export default BulkRegestrationForm;
