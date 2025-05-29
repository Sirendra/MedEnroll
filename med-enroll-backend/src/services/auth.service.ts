import bcrypt from "bcryptjs";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { GenericResponse } from "../interfaces/genericReponse.interface";
import { buildRegExpForWord, capitalizeSmart } from "../helpers/customerHelper";

export const login = async (
  userName: string,
  password: string
): Promise<GenericResponse<{ token: string }>> => {
  try {
    const user = await User.findOne({ userName: buildRegExpForWord(userName) });
    if (!user) {
      return {
        status: 400,
        message: "Invalid credentials.",
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 400,
        message: "Invalid credentials.",
      };
    }
    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    return {
      status: 200,
      message: "Successfully logged in.",
      data: { token },
    };
  } catch (err: any) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

export const register = async (
  userName: string,
  password: string,
  adminKey: string,
  fullName: string
) => {
  try {
    if (adminKey !== process.env.ADMIN_KEY) {
      return {
        status: 400,
        message: "Invalid admin key.",
      };
    }
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      password: hashed,
      fullName: capitalizeSmart(fullName),
    });
    await newUser.save();
    return {
      status: 201,
      message: "User have been successfully created.",
    };
  } catch (err: any) {
    return {
      status: 400,
      message: err.message,
    };
  }
};
