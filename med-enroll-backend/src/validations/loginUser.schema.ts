import { z } from "zod";
export const loginValidationObject = {
  userName: z.preprocess(
    (val: any) => {
      if (typeof val === "string") return val.trim();
      return val;
    },
    z
      .string({
        required_error: "Username is required",
      })
      .nonempty("Username is required")
  ),

  password: z.preprocess(
    (val: any) => {
      if (typeof val === "string") return val.trim();
      return val;
    },
    z
      .string({
        required_error: "Password is required",
      })
      .nonempty("Password is required")
  ),
};

export const loginUserSchema = z.object(loginValidationObject);

export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
