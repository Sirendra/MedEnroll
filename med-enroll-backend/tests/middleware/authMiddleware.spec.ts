import { authMiddleware } from "../../src/middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "testsecret";
  });

  it("should return 401 if no authorization header", () => {
    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is malformed", () => {
    req.headers = {
      authorization: "BadHeader",
    };

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers = {
      authorization: "Bearer invalid.token",
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach user to req if token is valid", () => {
    req.headers = {
      authorization: "Bearer valid.token",
    };

    const decoded = { userId: "123", fullName: "John Doe" };
    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    authMiddleware(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid.token", "testsecret");
    expect(req.user).toEqual({ userId: "123", fullName: "John Doe" });
    expect(next).toHaveBeenCalled();
  });
});
