// db.spec.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../../src/config/db";

describe("connectDB", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer?.stop();
  });

  it("connects to MongoDB successfully", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^MongoDB connected:/)
    );
    logSpy.mockRestore();
  });

  it("logs error and exits on connection failure", async () => {
    process.env.MONGO_URI = "mongodb://invalid_uri";
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(connectDB()).rejects.toThrow("process.exit called");

    expect(errorSpy).toHaveBeenCalledWith(
      "MongoDB connection failed:",
      expect.any(Error)
    );

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
