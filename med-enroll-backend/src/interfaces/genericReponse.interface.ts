import { Customer } from "./customer.interface";

export interface GenericResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: any;
}
