"use client";
import { createChapter } from "@/actions/createChapter";
import { updateChapter } from "@/actions/updateChapter";
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
import { ChapterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ChapterFrom = ({ chapter, sectionId }: { chapter: Chapter | null; sectionId: string }) => {
  const form = useForm<z.infer<typeof ChapterSchema>>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: {
      name: (chapter && chapter.name) || "",
      sectionId: sectionId,
    },
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof ChapterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      chapter &&
        chapter.id &&
        updateChapter(values, chapter.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign(`/teacher/sections/${sectionId}/chapter/${chapter.id}`);
            }
          })
          .catch(() => setError("Something went wrong"));
      !chapter &&
        createChapter(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign(`/teacher/sections/${sectionId}`);
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
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Chapter Name ...."
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            {chapter ? "Save Changes" : "Create Chapter"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChapterFrom;
