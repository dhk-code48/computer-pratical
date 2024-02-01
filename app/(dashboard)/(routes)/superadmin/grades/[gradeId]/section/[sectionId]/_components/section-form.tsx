"use client";
import { createGrade } from "@/actions/createGrade";
import { createSection } from "@/actions/createSection";
import { updateGrade } from "@/actions/updateGrade";
import { updateSection } from "@/actions/updateSection";
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
import { SectionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade, Section } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SectionFrom = ({ gradeId, section }: { gradeId: string; section: Section | null }) => {
  const form = useForm<z.infer<typeof SectionSchema>>({
    resolver: zodResolver(SectionSchema),
    defaultValues: {
      name: (section && section.name) || "",
      gradeId: gradeId,
    },
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof SectionSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      section &&
        section.id &&
        updateSection(values, section.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/grades/" + gradeId);
            }
          })
          .catch(() => setError("Something went wrong"));
      !section &&
        createSection(values, gradeId)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/grades/" + gradeId);
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
                    <Input {...field} disabled={isPending} placeholder="A" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            {section ? "Save Changes" : "Create Section"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SectionFrom;
