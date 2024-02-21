"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Shell } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";

import { TeacherSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { Grade, Section, User, UserRole } from "@prisma/client";
import { createTeacher } from "@/actions/createTeacher";
import { updateTeacher } from "@/actions/updateTeacher";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  grades: { name: string; sections: Section[] }[];
  teacherId: string;
  teacher: (User & { sections: (Section & { grade: Grade })[] }) | null;
}

const TeacherForm = ({
  className,
  grades,
  teacher,
  teacherId,
  ...props
}: UserAuthFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      email: (teacher && teacher.email) || "",
      password: "",
      sections: [""],
      name: (teacher && teacher.name) || "",
    },
  });

  const onSubmit = (values: z.infer<typeof TeacherSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      teacher &&
        updateTeacher(values, teacherId)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }
            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/teachers");
            }
          })
          .catch(() => setError("Something went wrong"));

      !teacher &&
        createTeacher(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }
            if (data?.success) {
              form.reset();
              setSuccess(data.success);
              window.location.assign("/superadmin/teachers");
            }
          })
          .catch(() => setError("Something went wrong"));
    });
  };

  const [sectionOptions, setSectionOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    setSectionOptions([]);
    grades.map((grade) => {
      grade.sections.map((section) => {
        setSectionOptions((prev) => [
          ...prev,
          { label: grade.name + " " + section.name, value: section.id },
        ]);
      });
    });
  }, [grades]);

  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Darshan Dhakal"
                      type="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="gbs79550@gbs.edu.np"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Section</FormLabel>
                  <FormControl>
                    <Select
                      options={sectionOptions}
                      isMulti
                      onChange={(e) =>
                        form.setValue("sections", [...e.map((p) => p.value)])
                      }
                    />
                  </FormControl>
                  {teacher && (
                    <FormDescription>
                      Previously Assigned Sections{" "}
                      {teacher.sections.map(
                        (section) => section.grade.name + " " + section.name
                      )}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {teacher ? "Update Teacher" : "Create Teacher"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TeacherForm;
