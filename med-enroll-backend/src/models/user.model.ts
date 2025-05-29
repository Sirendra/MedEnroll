import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userName: string;
  password: string;
  fullName: string;
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", userSchema);
