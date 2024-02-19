"use client";
import { createBatch } from "@/actions/createBatch";

import { updateBatch } from "@/actions/updateBatch";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BatchSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Batch } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const GradeFrom = ({ batch }: { batch: Batch | null }) => {
  const form = useForm<z.infer<typeof BatchSchema>>({
    resolver: zodResolver(BatchSchema),
    defaultValues: {
      name: (batch && batch.name) || "",
      isActive: (batch && batch.isActive) || false,
    },
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof BatchSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      batch &&
        batch.id &&
        updateBatch(values, batch.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/batches/" + batch.id);
            }
          })
          .catch(() => setError("Something went wrong"));
      !batch &&
        createBatch(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/batches/");
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
                      placeholder="12"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Batch Active ?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            {batch ? "Save Changes" : "Create Batch"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GradeFrom;
