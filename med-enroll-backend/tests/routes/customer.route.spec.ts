import { Router } from "express";
import * as customerController from "../../src/controllers/customer.controller";

jest.mock("express", () => {
  const actual = jest.requireActual("express");
  return {
    ...actual,
    Router: jest.fn().mockReturnValue({
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
    }),
  };
});

describe("customerRoutes", () => {
  it("should define all customer routes with correct handlers", () => {
    const mockedRouter = Router() as jest.Mocked<ReturnType<typeof Router>>;

    require("../../src/routes/customer.route");

    expect(mockedRouter.get).toHaveBeenCalledWith(
      "/",
      customerController.searchCustomers
    );
    expect(mockedRouter.get).toHaveBeenCalledWith(
      "/all",
      customerController.getAllCustomers
    );
    expect(mockedRouter.put).toHaveBeenCalledWith(
      "/:id",
      customerController.updateCustomers
    );
    expect(mockedRouter.post).toHaveBeenCalledWith(
      "/",
      customerController.createCustomer
    );
    expect(mockedRouter.post).toHaveBeenCalledWith(
      "/filters",
      customerController.searchCustomersWithStartWith
    );
  });
});
