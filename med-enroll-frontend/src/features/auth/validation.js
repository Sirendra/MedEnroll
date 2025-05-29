import { z } from "zod";

const commonSchema = {
  userName: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
};

export const loginSchema = z.object({
  ...commonSchema,
});

export const registerSchema = z
  .object({
    ...commonSchema,
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters"),
    adminKey: z.string().min(1, "Admin key is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
