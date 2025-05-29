import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.preprocess(
    (val: any) => {
      if (typeof val === "string") return val.trim();
      return val;
    },
    z
      .string({
        required_error: "First name is required",
      })
      .nonempty("First name is required")
      .min(3, "First name must be at least 3 characters")
  ),

  lastName: z.preprocess(
    (val: any) => {
      if (typeof val === "string") return val.trim();
      return val;
    },
    z
      .string({
        required_error: "Last name is required",
      })
      .nonempty("Last name is required")
      .min(3, "Last name must be at least 3 characters")
  ),
  fullName: z.string().optional(),
});

export type CustomerSchemaType = z.infer<typeof customerSchema>;
