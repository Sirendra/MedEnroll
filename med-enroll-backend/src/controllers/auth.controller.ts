import { Request, Response } from "express";
import { loginUserSchema } from "../validations/loginUser.schema";
import { registerUserSchema } from "../validations/registerUser.schema";
import * as authService from "../services/auth.service";
import { buildResponseJson } from "../helpers/customerHelper";

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors[0].message,
    });
    return;
  }
  const { userName, password } = req.body;
  const response = await authService.login(userName, password);
  res.status(response.status).json(buildResponseJson(response));
};

export const register = async (req: Request, res: Response) => {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors[0].message,
    });
    return;
  }
  const { userName, password, adminKey, fullName } = req.body;
  const response = await authService.register(
    userName,
    password,
    adminKey,
    fullName
  );
  res.status(response.status).json(buildResponseJson(response));
};
