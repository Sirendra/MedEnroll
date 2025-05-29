import { Request, Response } from "express";
import { customerSchema } from "../validations/customer.schema";
import { filterCustomerSchema } from "../validations/filterCustomer.schema";
import * as customerService from "../services/customer.service";
import { buildResponseJson } from "../helpers/customerHelper";
import { Types } from "mongoose";

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = customerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors[0].message,
    });
    return;
  }
  if (!req?.user?.userId) {
    res.status(400).json({
      message: "No user found",
    });
    return;
  }

  const response = await customerService.createCustomer(
    result.data,
    req.user.userId
  );
  res.status(response.status).json(buildResponseJson(response));
};

export const updateCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const existingCustomerId = req.params.id;
  if (!existingCustomerId) {
    res.status(400).json({
      message: "No customer id is provided",
    });
    return;
  }
  if (!req?.user?.userId) {
    res.status(400).json({
      message: "No user found",
    });
    return;
  }
  if (!Types.ObjectId.isValid(existingCustomerId)) {
    res.status(400).json({ error: "Invalid customer ID" });
    return;
  }
  const result = customerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors[0].message,
    });
    return;
  }

  const response = await customerService.updateCustomer(
    existingCustomerId,
    result.data,
    req.user.userId
  );
  res.status(response.status).json(buildResponseJson(response));
};

export const searchCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const fullName = req.query?.fullName as string | undefined;
  const limit = req.query?.limit as string | undefined;

  if (!fullName && !limit) {
    res.status(400).json({
      message: "Please provide query",
    });
    return;
  }
  if (!req?.user?.userId) {
    res.status(400).json({
      message: "No user",
    });
    return;
  }
  const response = await customerService.searchCustomers(
    req.user.userId,
    fullName,
    limit
  );
  res.status(response.status).json(buildResponseJson(response));
};

export const getAllCustomers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const response = await customerService.getAllCustomers();
  res.status(response.status).json(buildResponseJson(response));
};

export const searchCustomersWithStartWith = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = filterCustomerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors[0].message,
    });
    return;
  }
  const response = await customerService.searchCustomersWithStartWith(
    result.data.firstName,
    result.data.lastName
  );
  res.status(response.status).json(buildResponseJson(response));
};
