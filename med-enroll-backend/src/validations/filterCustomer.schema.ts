import { z } from "zod";

export const filterCustomerSchema = z.object({
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
  ),
});

export type FilterCustomerSchemaType = z.infer<typeof filterCustomerSchema>;
