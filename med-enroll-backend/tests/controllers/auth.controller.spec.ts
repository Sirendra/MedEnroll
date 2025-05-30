import { login, register } from "../../src/controllers/auth.controller";
import * as authService from "../../src/services/auth.service";
import { buildResponseJson } from "../../src/helpers/customerHelper";
import { Request, Response } from "express";

jest.mock("../../src/services/auth.service");
jest.mock("../../src/helpers/customerHelper");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  describe("login", () => {
    it("should return 400 if validation fails", async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });

    it("should call authService.login and return response", async () => {
      const req = {
        body: { userName: "test", password: "pass" },
      } as Request;
      const res = mockResponse();

      const fakeServiceResponse = { status: 200, data: { token: "abc123" } };
      (authService.login as jest.Mock).mockResolvedValue(fakeServiceResponse);
      (buildResponseJson as jest.Mock).mockReturnValue({
        success: true,
        data: fakeServiceResponse.data,
      });

      await login(req, res);

      expect(authService.login).toHaveBeenCalledWith("test", "pass");
      expect(buildResponseJson).toHaveBeenCalledWith(fakeServiceResponse);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeServiceResponse.data,
      });
    });
  });

  describe("register", () => {
    it("should return 400 if validation fails", async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });

    it("should call authService.register and return response", async () => {
      const req = {
        body: {
          userName: "john",
          password: "pass123",
          adminKey: "secret",
          fullName: "John Doe",
        },
      } as Request;
      const res = mockResponse();

      const fakeServiceResponse = { status: 201, data: { userId: "abc" } };
      (authService.register as jest.Mock).mockResolvedValue(
        fakeServiceResponse
      );
      (buildResponseJson as jest.Mock).mockReturnValue({
        success: true,
        data: fakeServiceResponse.data,
      });

      await register(req, res);

      expect(authService.register).toHaveBeenCalledWith(
        "john",
        "pass123",
        "secret",
        "John Doe"
      );
      expect(buildResponseJson).toHaveBeenCalledWith(fakeServiceResponse);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeServiceResponse.data,
      });
    });
  });
});
