import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const GradeSchema = z.object({
  name: z.string().min(1),
});
export const ChapterSchema = z.object({
  name: z.string().min(1),
  sectionId: z.string().min(1),
});
export const SectionSchema = z.object({
  name: z.string().min(1),
  gradeId: z.string().min(1),
});

export const WorksheetSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  published: z.boolean(),
});

export const TeacherSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  sections: z.array(z.string().min(1)).min(1, {
    message: "Minimun of 1 section required",
  }),
});
