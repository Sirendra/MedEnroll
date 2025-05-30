import * as customerService from "../../src/services/customer.service";
import Customer from "../../src/models/customer.model";
import * as customerHelper from "../../src/helpers/customerHelper";

jest.mock("../../src/models/customer.model", () => jest.fn());
jest.mock("../../src/helpers/customerHelper", () => ({
  buildRegExpForWord: jest.fn((s) => s),
  buildRegExpForFirstChar: jest.fn((c) => c),
  capitalizeSmart: jest.fn((s) => s),
}));

describe("customerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCustomer", () => {
    it("should return 409 if customer exists", async () => {
      const leanMock = jest.fn().mockResolvedValueOnce(true);
      const findOneMock = jest.fn().mockImplementationOnce(() => ({
        lean: leanMock,
      }));

      (Customer.findOne as jest.Mock) = findOneMock;

      const res = await customerService.createCustomer(
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(409);
      expect(res.message).toBe("Customer already exists.");
    });

    it("should return 201 on successful creation", async () => {
      const leanMock = jest.fn().mockResolvedValueOnce(null);
      const findOneMock = jest.fn().mockImplementationOnce(() => ({
        lean: leanMock,
      }));
      const createMock = jest.fn().mockResolvedValueOnce({ _id: "c1" });
      (Customer.create as jest.Mock) = createMock;
      (Customer.findOne as jest.Mock) = findOneMock;

      const res = await customerService.createCustomer(
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(201);
      expect(res.message).toBe("Customer added successfully");
      expect(res.data).toBeDefined();
    });

    it("should handle error", async () => {
      const leanMock = jest.fn().mockRejectedValueOnce(new Error("save error"));
      const findOneMock = jest.fn().mockImplementationOnce(() => ({
        lean: leanMock,
      }));
      (Customer.findOne as jest.Mock) = findOneMock;
      const res = await customerService.createCustomer(
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(500);
      expect(res.message).toMatch(/server error/i);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe("updateCustomer", () => {
    it("should return 409 if name already exists", async () => {
      const validObjectId = "60f718a59e3e4b3b9c8a9b21";
      const findOneMock = jest.fn().mockResolvedValueOnce(true);
      (Customer.findOne as jest.Mock) = findOneMock;
      const res = await customerService.updateCustomer(
        validObjectId,
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(409);
    });

    it("should return 404 if not found", async () => {
      const validObjectId = "60f718a59e3e4b3b9c8a9b21";
      const findOneMock = jest.fn().mockResolvedValueOnce(null);
      const findByIdAndUpdateMock = jest.fn().mockResolvedValueOnce(null);
      (Customer.findByIdAndUpdate as jest.Mock) = findByIdAndUpdateMock;
      (Customer.findOne as jest.Mock) = findOneMock;

      const res = await customerService.updateCustomer(
        validObjectId,
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(404);
    });

    it("should return 201 on success", async () => {
      const validObjectId = "60f718a59e3e4b3b9c8a9b21";

      const findOneMock = jest.fn().mockResolvedValueOnce(null);
      const findByIdAndUpdateMock = jest
        .fn()
        .mockResolvedValue({ _id: validObjectId });

      (Customer.findByIdAndUpdate as jest.Mock) = findByIdAndUpdateMock;
      (Customer.findOne as jest.Mock) = findOneMock;

      const res = await customerService.updateCustomer(
        validObjectId,
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(201);
      expect(res.message).toMatch(/updated successfully/i);
    });

    it("should handle error", async () => {
      const findOneMock = jest
        .fn()
        .mockRejectedValueOnce(new Error("save error"));
      (Customer as unknown as jest.Mock).mockImplementationOnce(() => ({
        findOne: findOneMock,
      }));

      const res = await customerService.updateCustomer(
        "c1",
        { firstName: "John", lastName: "Doe" },
        "u1"
      );

      expect(res.status).toBe(500);
      expect(res.error).toBeInstanceOf(Error);
    });
  });

  describe("searchCustomers", () => {
    it("should return customers matching fullName", async () => {
      const findMock = jest.fn().mockResolvedValueOnce([{ _id: "c1" }]);
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.searchCustomers("u1", "John");

      expect(findMock).toHaveBeenCalledWith({
        fullName: new RegExp("John", "i"),
      });
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      expect(res.message).toMatch(/successfully retrived/i);
    });

    it("should return customers by userId with limit and sort when fullName not provided", async () => {
      const leanMock = jest.fn().mockResolvedValueOnce([{ _id: "c2" }]);
      const findMock = jest.fn().mockImplementationOnce(() => ({
        lean: leanMock,
      }));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.searchCustomers("u1", undefined, "5");

      expect(findMock).toHaveBeenCalledWith(
        { lastModifiedBy: "u1" },
        {},
        { limit: 5, sort: { updatedAt: -1 } }
      );
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      expect(res.message).toMatch(/successfully retrived/i);
    });

    it("should handle errors", async () => {
      const findMock = jest.fn().mockRejectedValueOnce(new Error("find error"));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.searchCustomers("u1", "John");

      expect(res.status).toBe(500);
      expect(res.error).toBeInstanceOf(Error);
      expect(res.message).toMatch(/server error/i);
    });
  });

  describe("searchCustomersWithStartWith", () => {
    it("should return matched customers", async () => {
      const selectMock = jest
        .fn()
        .mockResolvedValueOnce([{ firstName: "J", lastName: "D" }]);
      const findMock = jest.fn().mockImplementationOnce(() => ({
        select: selectMock,
      }));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.searchCustomersWithStartWith(
        "John",
        "Doe"
      );

      expect(findMock).toHaveBeenCalledWith({
        $and: [
          { firstName: customerHelper.buildRegExpForFirstChar("J") },
          { lastName: customerHelper.buildRegExpForFirstChar("D") },
        ],
      });
      expect(selectMock).toHaveBeenCalledWith("firstName lastName");
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      expect(res.message).toMatch(/successfully retrived/i);
    });

    it("should handle errors", async () => {
      const findMock = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockRejectedValueOnce(new Error("find error")),
      }));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.searchCustomersWithStartWith(
        "John",
        "Doe"
      );

      expect(res.status).toBe(500);
      expect(res.error).toBeInstanceOf(Error);
      expect(res.message).toMatch(/server error/i);
    });
  });

  describe("getAllCustomers", () => {
    it("should return all customers with firstName and lastName", async () => {
      const selectMock = jest
        .fn()
        .mockResolvedValueOnce([{ firstName: "John", lastName: "Doe" }]);
      const findMock = jest.fn().mockImplementationOnce(() => ({
        select: selectMock,
      }));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.getAllCustomers();

      expect(findMock).toHaveBeenCalledWith({});
      expect(selectMock).toHaveBeenCalledWith("firstName lastName");
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      expect(res.message).toMatch(/successfully retrived/i);
    });

    it("should handle errors", async () => {
      const findMock = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockRejectedValueOnce(new Error("find error")),
      }));
      (Customer.find as jest.Mock) = findMock;

      const res = await customerService.getAllCustomers();

      expect(res.status).toBe(500);
      expect(res.error).toBeInstanceOf(Error);
      expect(res.message).toMatch(/server error/i);
    });
  });
  // Other tests (searchCustomers, searchCustomersWithStartWith, getAllCustomers) would be converted similarly to two-step mocks as well.
});
