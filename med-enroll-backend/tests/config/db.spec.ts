import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../../src/config/db";

describe("connectDB", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await mongoServer.stop();
  });

  it("connects to MongoDB successfully", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it("logs error and exits on connection failure", async () => {
    const connectSpy = jest
      .spyOn(mongoose, "connect")
      .mockImplementation(() => {
        return Promise.reject(new Error("Failed to connect"));
      });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(connectDB()).rejects.toThrow("process.exit called");

    expect(errorSpy).toHaveBeenCalledWith(
      "MongoDB connection failed:",
      expect.any(Error)
    );

    connectSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
