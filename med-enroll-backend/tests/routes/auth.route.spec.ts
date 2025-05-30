import { Router } from "express";
import * as authController from "../../src/controllers/auth.controller";

jest.mock("express", () => {
  const actual = jest.requireActual("express");
  return {
    ...actual,
    Router: jest.fn().mockReturnValue({
      post: jest.fn(),
    }),
  };
});

describe("authRoutes", () => {
  it("should define POST /register and POST /login routes", () => {
    const mockedRouter = Router() as jest.Mocked<ReturnType<typeof Router>>;

    require("../../src/routes/auth.route");

    expect(mockedRouter.post).toHaveBeenCalledWith(
      "/register",
      authController.register
    );
    expect(mockedRouter.post).toHaveBeenCalledWith(
      "/login",
      authController.login
    );
  });
});
