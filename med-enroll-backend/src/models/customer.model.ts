import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  lastModifiedBy: string;
}

const CustomerSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    lastModifiedBy: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

CustomerSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
