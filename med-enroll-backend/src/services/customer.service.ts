import { Types } from "mongoose";
import {
  buildRegExpForFirstChar,
  buildRegExpForWord,
} from "../helpers/customerHelper";
import { GenericResponse } from "../interfaces/genericReponse.interface";
import Customer from "../models/customer.model";
import { CustomerSchemaType } from "../validations/customer.schema";
import { capitalizeSmart } from "../helpers/customerHelper";

export const createCustomer = async (
  customerData: CustomerSchemaType,
  userId?: string
): Promise<GenericResponse<CustomerSchemaType>> => {
  const { firstName, lastName } = customerData;

  try {
    const existing = await Customer.findOne({
      firstName: buildRegExpForWord(firstName),
      lastName: buildRegExpForWord(lastName),
    }).lean();
    if (existing) {
      return { status: 409, message: "Customer already exists." };
    }

    const newCustomer = await Customer.create({
      firstName,
      lastName,
      fullName: capitalizeSmart(`${firstName} ${lastName}`),
      lastModifiedBy: userId,
    });
    return {
      status: 201,
      message: "Customer added successfully",
      data: newCustomer,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An server error occured while creating customer",
      error,
    };
  }
};

export const updateCustomer = async (
  id: string,
  customerData: CustomerSchemaType,
  userId: string
): Promise<GenericResponse<CustomerSchemaType>> => {
  const { firstName, lastName } = customerData;

  try {
    const existing = await Customer.findOne({
      _id: { $ne: new Types.ObjectId(id) },
      firstName: buildRegExpForWord(firstName),
      lastName: buildRegExpForWord(lastName),
    });
    if (existing) {
      return {
        status: 409,
        message: "Customer with provided name already exists.",
      };
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        firstName,
        lastName,
        fullName: capitalizeSmart(`${firstName} ${lastName}`),
        lastModifiedBy: userId,
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return { status: 404, message: "Customer not found" };
    }
    return {
      status: 201,
      message: "Customer updated successfully",
      data: updatedCustomer,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An server error occured while creating customer",
      error,
    };
  }
};

export const searchCustomers = async (
  userId: string,
  fullName?: string,
  limit?: string
): Promise<GenericResponse<CustomerSchemaType[]>> => {
  try {
    if (fullName) {
      const customers = await Customer.find({
        fullName: new RegExp(fullName, "i"),
      });
      return {
        status: 200,
        message: "Successfully retrived customer(s)",
        data: customers,
      };
    } else {
      const customers = await Customer.find(
        { lastModifiedBy: userId },
        {},
        { limit: Number(limit) || 3, sort: { updatedAt: -1 } }
      ).lean();

      return {
        status: 200,
        message: "Successfully retrived customer(s)",
        data: customers,
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: "An server error occured while searching for customer(s)",
      error,
    };
  }
};

export const searchCustomersWithStartWith = async (
  firstName: string,
  lastName: string
): Promise<GenericResponse<CustomerSchemaType[]>> => {
  try {
    const matchedCustomers = await Customer.find({
      $and: [
        { firstName: buildRegExpForFirstChar(firstName[0]) },
        { lastName: buildRegExpForFirstChar(lastName[0]) },
      ],
    }).select("firstName lastName");

    return {
      status: 200,
      message: "Successfully retrived matched customer(s)",
      data: matchedCustomers,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An server error occured while searching for customer(s)",
      error,
    };
  }
};

export const getAllCustomers = async (): Promise<
  GenericResponse<CustomerSchemaType[]>
> => {
  try {
    const customers = await Customer.find({}).select("firstName lastName");
    return {
      status: 200,
      message: "Successfully retrived customer(s)",
      data: customers,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An server error occured while searching for customer(s)",
      error,
    };
  }
};
