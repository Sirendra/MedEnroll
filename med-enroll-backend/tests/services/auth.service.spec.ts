import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../src/models/user.model";
import * as authService from "../../src/services/auth.service";
import { capitalizeSmart } from "../../src/helpers/customerHelper";

jest.mock("../../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("../../src/helpers/customerHelper");

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if adminKey invalid", async () => {
      process.env.ADMIN_KEY = "correctKey";
      const res = await authService.register(
        "user",
        "pass",
        "wrongKey",
        "fullname"
      );
      expect(res.status).toBe(400);
      expect(res.message).toBe("Invalid admin key.");
    });

    it("should create user and return 201", async () => {
      process.env.ADMIN_KEY = "correctKey";

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
      (capitalizeSmart as jest.Mock).mockReturnValue("Full Name");

      // Mock User constructor and save instance method:
      const saveMock = jest.fn().mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: saveMock,
      }));

      const res = await authService.register(
        "user",
        "pass",
        "correctKey",
        "fullname"
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("pass", 10);
      expect(capitalizeSmart).toHaveBeenCalledWith("fullname");
      expect(saveMock).toHaveBeenCalled();

      expect(res.status).toBe(201);
      expect(res.message).toBe("User have been successfully created.");
    });

    it("should handle save error", async () => {
      process.env.ADMIN_KEY = "correctKey";

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
      (capitalizeSmart as jest.Mock).mockReturnValue("Full Name");

      const saveMock = jest.fn().mockRejectedValue(new Error("save error"));
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: saveMock,
      }));

      const res = await authService.register(
        "user",
        "pass",
        "correctKey",
        "fullname"
      );

      expect(res.status).toBe(400);
      expect(res.message).toBe("save error");
    });
  });

  describe("login", () => {
    it("should return 400 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const res = await authService.login("user", "pass");
      expect(res.status).toBe(400);
      expect(res.message).toBe("Invalid credentials.");
    });

    it("should return 400 if password mismatch", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: "hashedpass" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await authService.login("user", "wrongpass");

      expect(res.status).toBe(400);
      expect(res.message).toBe("Invalid credentials.");
    });

    it("should return 200 and token if successful", async () => {
      const user = {
        _id: "userId",
        fullName: "Full Name",
        password: "hashedpass",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue("token" as any);

      const res = await authService.login("user", "pass");

      expect(res.status).toBe(200);
      expect(res.data?.token).toBe("token");
    });

    it("should handle errors", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error("fail"));

      const res = await authService.login("user", "pass");

      expect(res.status).toBe(500);
      expect(res.message).toBe("fail");
    });
  });
});
