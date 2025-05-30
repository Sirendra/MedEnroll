import { Request, Response } from "express";
import {
  createCustomer,
  updateCustomers,
  searchCustomers,
  getAllCustomers,
  searchCustomersWithStartWith,
} from "../../src/controllers/customer.controller";
import * as customerService from "../../src/services/customer.service";
import { buildResponseJson } from "../../src/helpers/customerHelper";

jest.mock("../../src/services/customer.service");
jest.mock("../../src/helpers/customerHelper");

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Customer Controller", () => {
  describe("createCustomer", () => {
    it("should return 400 if validation fails", async () => {
      const req = { body: {}, user: { userId: "123" } } as unknown as Request;
      const res = mockRes();

      await createCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if user not found", async () => {
      const req = { body: { firstName: "A" } } as unknown as Request;
      const res = mockRes();

      await createCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should call service and respond with success", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          age: 30,
        },
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      const serviceResp = { status: 201, data: { _id: "abc" } };
      (customerService.createCustomer as jest.Mock).mockResolvedValue(
        serviceResp
      );
      (buildResponseJson as jest.Mock).mockReturnValue({ success: true });

      await createCustomer(req, res);

      expect(customerService.createCustomer).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateCustomers", () => {
    it("should return 400 if id is not provided", async () => {
      const req = {
        params: {},
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      await updateCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if user is missing", async () => {
      const req = {
        params: { id: "abc123" },
        body: {},
      } as unknown as Request;
      const res = mockRes();

      await updateCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for invalid ObjectId", async () => {
      const req = {
        params: { id: "invalid-id" },
        body: {},
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      await updateCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if validation fails", async () => {
      const req = {
        params: { id: "64f68cd7fc13ae4b2c000000" },
        body: {},
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      await updateCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should update customer successfully", async () => {
      const req = {
        params: { id: "64f68cd7fc13ae4b2c000000" },
        body: { firstName: "John", lastName: "Doe", age: 25 },
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      const serviceResp = { status: 200, data: {} };
      (customerService.updateCustomer as jest.Mock).mockResolvedValue(
        serviceResp
      );
      (buildResponseJson as jest.Mock).mockReturnValue({ success: true });

      await updateCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("searchCustomers", () => {
    it("should return 400 if no query is provided", async () => {
      const req = {
        query: {},
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      await searchCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if user not found", async () => {
      const req = {
        query: { fullName: "A" },
      } as unknown as Request;
      const res = mockRes();

      await searchCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should search and respond successfully", async () => {
      const req = {
        query: { fullName: "A" },
        user: { userId: "123" },
      } as unknown as Request;
      const res = mockRes();

      const serviceResp = { status: 200, data: [] };
      (customerService.searchCustomers as jest.Mock).mockResolvedValue(
        serviceResp
      );
      (buildResponseJson as jest.Mock).mockReturnValue({ success: true });

      await searchCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getAllCustomers", () => {
    it("should return all customers", async () => {
      const req = {} as Request;
      const res = mockRes();

      const serviceResp = { status: 200, data: [] };
      (customerService.getAllCustomers as jest.Mock).mockResolvedValue(
        serviceResp
      );
      (buildResponseJson as jest.Mock).mockReturnValue({ success: true });

      await getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("searchCustomersWithStartWith", () => {
    it("should return 400 if validation fails", async () => {
      const req = {
        body: {},
      } as unknown as Request;
      const res = mockRes();

      await searchCustomersWithStartWith(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return matching customers", async () => {
      const req = {
        body: {
          firstName: "Jo",
          lastName: "Do",
        },
      } as unknown as Request;
      const res = mockRes();

      const serviceResp = { status: 200, data: [] };
      (
        customerService.searchCustomersWithStartWith as jest.Mock
      ).mockResolvedValue(serviceResp);
      (buildResponseJson as jest.Mock).mockReturnValue({ success: true });

      await searchCustomersWithStartWith(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
