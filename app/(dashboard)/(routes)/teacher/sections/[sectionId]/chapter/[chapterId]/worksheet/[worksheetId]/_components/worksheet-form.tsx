"use client";
import { createGrade } from "@/actions/createGrade";
import { createWorksheet } from "@/actions/createWorksheet";
import { updateGrade } from "@/actions/updateGrade";
import { updateWorksheet } from "@/actions/updateWorksheet";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { WorksheetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade, WorkSheet } from "@prisma/client";
import { CheckCheck, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const WorksheetFrom = ({
  worksheet,
  chapterId,
  sectionId,
  teacherId,
}: {
  worksheet: WorkSheet | null;
  chapterId: string;
  sectionId: string;
  teacherId: string;
}) => {
  const form = useForm<z.infer<typeof WorksheetSchema>>({
    resolver: zodResolver(WorksheetSchema),
    defaultValues: {
      name: (worksheet && worksheet.name) || "",
      published: (worksheet && worksheet.published) || false,
    },
  });

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);

  const pdfLink = worksheet
    ? "http://129.150.50.164:3002/pdf/" + worksheet.id + ".pdf"
    : "";

  async function onSubmit(values: z.infer<typeof WorksheetSchema>) {
    try {
      setError("");
      setSuccess("");

      let data = new FormData();
      data.append("file", file || "");
      data.append("name", values.name);
      data.append("chapterId", chapterId.toString());
      data.append("teacherId", teacherId);
      data.append("sectionId", sectionId);
      data.append("published", JSON.stringify(values.published));
      data.append("worksheetId", (worksheet && worksheet.id) || "");

      const newWorkSheet = worksheet
        ? await updateWorksheet(data)
        : await createWorksheet(data);

      console.log("newWorkSheet = > ", newWorkSheet);

      if (!newWorkSheet) {
        setError("Error while creating/upadating worksheets");
      } else {
        setSuccess("Created Succesfully");

        worksheet
          ? window.location.assign(
              `/teacher/sections/${sectionId}/chapter/${chapterId}/worksheet/${worksheet.id}`
            )
          : window.location.assign(
              `/teacher/sections/${sectionId}/chapter/${chapterId}`
            );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  //   const onSubmit = (values: z.infer<typeof WorksheetSchema>) => {
  //     setError("");
  //     setSuccess("");
  //     startTransition(() => {
  //       worksheet &&
  //         worksheet.id &&
  //         updateGrade(values, worksheet.id)
  //           .then((data) => {
  //             if (data?.error) {
  //               form.reset();
  //               setError(data.error);
  //             }

  //             if (data?.success) {
  //               form.reset();
  //               setSuccess(data.success);
  //               window.location.assign("/superadmin/grades/" + worksheet.id);
  //             }
  //           })
  //           .catch(() => setError("Something went wrong"));
  //       !worksheet &&
  //         createWorksheet(values, chapterId, teacherId, file)
  //           .then((data) => {
  //             if (data?.error) {
  //               form.reset();
  //               setError(data.error);
  //             }

  //             if (data?.success) {
  //               form.reset();
  //               setSuccess(data.success);
  //               window.location.assign("/superadmin/grades/");
  //             }
  //           })
  //           .catch(() => setError("Something went wrong"));
  //     });
  //   };

  return (
    <div className="space-y-6 inline-block">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="12"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Input
              type="file"
              placeholder="Choose Your File"
              onChange={(e) => setFile(e.target.files && e.target.files[0])}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Worksheet</FormLabel>
                  <FormControl className="ml-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={worksheet ? worksheet.published : false}
                    />
                  </FormControl>
                  <p className="italic">
                    Note: Unpublishing Worksheet will delete students
                    grades/progress on worksheet
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            {worksheet ? "Save Changes" : "Create Worksheet"}
          </Button>
        </form>
      </Form>
      {worksheet && (
        <>
          <p>Current Worksheet</p>
          <object
            type="application/pdf"
            data={pdfLink}
            className="w-full h-[300px]"
          ></object>
        </>
      )}
    </div>
  );
};

export default WorksheetFrom;
