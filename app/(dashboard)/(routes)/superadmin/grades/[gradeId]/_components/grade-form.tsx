"use client";
import { createGrade } from "@/actions/createGrade";
import { updateGrade } from "@/actions/updateGrade";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const GradeFrom = ({ grade }: { grade: Grade | null }) => {
  const form = useForm<z.infer<typeof GradeSchema>>({
    resolver: zodResolver(GradeSchema),
    defaultValues: {
      name: (grade && grade.name) || "",
    },
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof GradeSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      grade &&
        grade.id &&
        updateGrade(values, grade.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/grades/" + grade.id);
            }
          })
          .catch(() => setError("Something went wrong"));
      !grade &&
        createGrade(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/grades/");
            }
          })
          .catch(() => setError("Something went wrong"));
    });
  };

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
                    <Input {...field} disabled={isPending} placeholder="12" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            {grade ? "Save Changes" : "Create Grade"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GradeFrom;
